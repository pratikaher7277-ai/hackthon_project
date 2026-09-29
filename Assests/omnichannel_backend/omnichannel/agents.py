"""Part A - channel agents.

One agent per channel. Each agent pulls raw records through a Connector, normalises them
into the shared schema and returns a ChannelSnapshot. Agents never raise: a failing channel
yields a snapshot with ok=False so one outage cannot break the whole run.

Where a channel needs judgement (free text), a SentimentScorer (LLM-capable) is plugged in.
"""
from __future__ import annotations

import asyncio
import time
from datetime import datetime, timezone
from typing import Optional, Protocol, Sequence, Awaitable, runtime_checkable

from .models import (Channel, ChannelSnapshot, DEFAULT_SCALES, Interaction,
                     RawRecord, ScaleSpec)
from .sentiment import LexiconScorer, SentimentScorer


class Connector(Protocol):
    """Implement one per real integration (Instagram Graph API, web analytics, ...)."""
    async def fetch(self, since: datetime, until: datetime) -> list[RawRecord]: ...


@runtime_checkable
class AsyncSentimentScorer(Protocol):
    """Protocol for async sentiment scorers (e.g., LLM-based)."""
    async def score_async(self, text: str) -> Optional[float]: ...


async def normalize_record_async(raw: RawRecord, scale: ScaleSpec, scorer: SentimentScorer) -> Interaction:
    satisfaction: Optional[float] = None
    if raw.score is not None:
        satisfaction = scale.normalize(raw.score)
    elif raw.text:
        if isinstance(scorer, AsyncSentimentScorer):
            sentiment = await scorer.score_async(raw.text)
        else:
            sentiment = scorer.score(raw.text)
        if sentiment is not None:
            satisfaction = ScaleSpec(-1.0, 1.0).normalize(sentiment)
    return Interaction(raw.channel, raw.customer_id, raw.timestamp, satisfaction)


def normalize_record(raw: RawRecord, scale: ScaleSpec, scorer: SentimentScorer) -> Interaction:
    """Sync version for sync scorers (lexicon only)."""
    satisfaction: Optional[float] = None
    if raw.score is not None:
        satisfaction = scale.normalize(raw.score)
    elif raw.text:
        sentiment = scorer.score(raw.text)
        if sentiment is not None:
            satisfaction = ScaleSpec(-1.0, 1.0).normalize(sentiment)
    return Interaction(raw.channel, raw.customer_id, raw.timestamp, satisfaction)


class ChannelAgent:
    def __init__(self, channel: Channel, connector: Connector, *,
                 scale: Optional[ScaleSpec] = None,
                 scorer: Optional[SentimentScorer] = None,
                 timeout_s: float = 10.0, retries: int = 2, backoff_s: float = 0.2):
        self.channel = channel
        self.connector = connector
        self.scale = scale or DEFAULT_SCALES[channel]
        self.scorer = scorer or LexiconScorer()
        self.timeout_s = timeout_s
        self.retries = retries
        self.backoff_s = backoff_s

    def _is_async_scorer(self) -> bool:
        return hasattr(self.scorer, 'score_async') and callable(getattr(self.scorer, 'score_async', None))

    async def scan(self, since: datetime, until: datetime) -> ChannelSnapshot:
        start = time.monotonic()
        last_error = "unknown error"
        for attempt in range(self.retries + 1):
            try:
                raws = await asyncio.wait_for(self.connector.fetch(since, until), self.timeout_s)
                if self._is_async_scorer():
                    interactions = await asyncio.gather(*[
                        normalize_record_async(r, self.scale, self.scorer) for r in raws
                    ])
                else:
                    interactions = [normalize_record(r, self.scale, self.scorer) for r in raws]
                return ChannelSnapshot(self.channel, interactions, datetime.now(timezone.utc),
                                       ok=True, duration_s=time.monotonic() - start,
                                       attempts=attempt + 1)
            except asyncio.CancelledError:
                raise
            except Exception as exc:  # isolate failures per channel
                last_error = f"{type(exc).__name__}: {exc}"
                if attempt < self.retries:
                    await asyncio.sleep(self.backoff_s * (2 ** attempt))
        return ChannelSnapshot(self.channel, [], datetime.now(timezone.utc), ok=False,
                               error=last_error, duration_s=time.monotonic() - start,
                               attempts=self.retries + 1)


async def scan_all(agents: Sequence[ChannelAgent], since: datetime,
                   until: datetime) -> list[ChannelSnapshot]:
    """Run all agents concurrently."""
    channels = [a.channel for a in agents]
    if len(set(channels)) != len(channels):
        raise ValueError("duplicate channel agents")
    return list(await asyncio.gather(*(a.scan(since, until) for a in agents)))

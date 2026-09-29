"""Simulated connectors with known ground truth, for demos, tests and evaluation.

Real integrations are NOT included: implement agents.Connector for each channel.
Every customer has a latent baseline satisfaction; a channel adds its own effect plus noise.
Because the truth is known, the evaluator can be measured against it.
"""
from __future__ import annotations

import random
from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import Optional

from .agents import ChannelAgent
from .models import Channel, DEFAULT_SCALES, RawRecord, ScaleSpec
from .sentiment import SentimentScorer

_POS = ["love this, great service", "amazing support, so helpful", "excellent and fast",
        "really good experience, easy to use"]
_MILD = ["good overall, nice", "fine and smooth", "happy with it"]
_MIXED = ["okay but slow", "good idea but confusing", "fine, though late"]
_NEG = ["terrible, worst experience", "slow and rude, disappointed", "awful, broken again",
        "bad and confusing, I hate it"]


def _clip(x: float) -> float:
    return max(0.0, min(1.0, x))


def _comment(rng: random.Random, true_sat: float) -> str:
    if true_sat > 0.8:
        pool = _POS
    elif true_sat > 0.62:
        pool = _MILD
    elif true_sat > 0.45:
        pool = _MIXED
    else:
        pool = _NEG
    return rng.choice(pool)


@dataclass
class ChannelSimSpec:
    channel: Channel
    n: int
    effect: float = 0.0        # channel effect on true satisfaction (0..1 units)
    noise_sd: float = 0.12
    missing_rate: float = 0.0  # share of records with no usable satisfaction
    lag_hours: float = 0.0     # newest data is this many hours old
    fail: bool = False         # simulate an outage


class SimulatedConnector:
    def __init__(self, spec: ChannelSimSpec, baselines: dict[str, float],
                 scale: ScaleSpec, seed: int):
        self.spec, self.baselines, self.scale, self.seed = spec, baselines, scale, seed

    async def fetch(self, since: datetime, until: datetime) -> list[RawRecord]:
        s = self.spec
        if s.fail:
            raise ConnectionError("simulated outage")
        rng = random.Random(self.seed)
        end = until - timedelta(hours=s.lag_hours)
        span = max(1.0, (end - since).total_seconds())
        ids = list(self.baselines)
        out: list[RawRecord] = []
        for _ in range(s.n):
            cid = rng.choice(ids)
            true_sat = _clip(self.baselines[cid] + s.effect + rng.gauss(0, s.noise_sd))
            ts = since + timedelta(seconds=rng.random() * span)
            if rng.random() < s.missing_rate:
                out.append(RawRecord(s.channel, cid, ts))
            elif s.channel is Channel.INSTAGRAM:
                out.append(RawRecord(s.channel, cid, ts, text=_comment(rng, true_sat)))
            else:
                width = self.scale.hi - self.scale.lo
                if width == 1:  # thumbs up / down
                    score = 1.0 if rng.random() < true_sat else 0.0
                else:
                    score = float(round(self.scale.lo + true_sat * width))
                out.append(RawRecord(s.channel, cid, ts, score=score))
        return out


DEFAULT_SCENARIO = [
    ChannelSimSpec(Channel.INSTAGRAM, 220, effect=-0.03, noise_sd=0.15),
    ChannelSimSpec(Channel.WEBSITE, 310, effect=0.04),
    ChannelSimSpec(Channel.CAMPAIGNS, 140, effect=-0.06, missing_rate=0.05),
    ChannelSimSpec(Channel.MOBILE_APP, 260, effect=0.07),
    ChannelSimSpec(Channel.BLOGS_OFFLINE, 12, effect=0.0, noise_sd=0.2),  # tiny sample
]


def build_simulated_agents(specs: Optional[list[ChannelSimSpec]] = None, *,
                           pool_size: int = 400, seed: int = 7,
                           scorer: Optional[SentimentScorer] = None) -> list[ChannelAgent]:
    specs = specs if specs is not None else DEFAULT_SCENARIO
    rng = random.Random(seed)
    baselines = {f"cust-{i:04d}": _clip(rng.gauss(0.68, 0.10)) for i in range(pool_size)}
    agents = []
    for k, spec in enumerate(specs):
        scale = DEFAULT_SCALES[spec.channel]
        connector = SimulatedConnector(spec, baselines, scale, seed=seed * 1000 + k)
        agents.append(ChannelAgent(spec.channel, connector, scale=scale, scorer=scorer,
                                   timeout_s=5.0, retries=1, backoff_s=0.01))
    return agents


def true_channel_means(specs: list[ChannelSimSpec], seed: int = 7,
                       pool_size: int = 400) -> dict[Channel, float]:
    """Ground truth: expected satisfaction per channel (baseline mean + channel effect)."""
    rng = random.Random(seed)
    base = [_clip(rng.gauss(0.68, 0.10)) for _ in range(pool_size)]
    m = sum(base) / len(base)
    return {s.channel: m + s.effect for s in specs}

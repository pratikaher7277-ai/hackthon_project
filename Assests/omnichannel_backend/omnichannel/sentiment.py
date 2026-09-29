"""Sentiment scoring for text-only channels (e.g. Instagram comments).

The default scorer is a tiny lexicon so the project runs offline. Replace it with an
LLM- or model-based scorer by implementing the SentimentScorer protocol.
"""
from __future__ import annotations

import math
import re
from typing import Optional, Protocol


class SentimentScorer(Protocol):
    def score(self, text: str) -> Optional[float]:
        """Return sentiment in [-1, 1], or None if it cannot be determined."""


class AsyncSentimentScorer(Protocol):
    """Protocol for async sentiment scorers (e.g., LLM-based)."""
    async def score_async(self, text: str) -> Optional[float]: ...


_WEIGHTS = {
    "love": 2, "loved": 2, "great": 2, "amazing": 2, "excellent": 2, "awesome": 2,
    "good": 1, "helpful": 1, "fast": 1, "smooth": 1, "happy": 1, "nice": 1, "easy": 1,
    "okay": 0.3, "fine": 0.3,
    "bad": -1, "slow": -1, "confusing": -1, "late": -1, "expensive": -0.5,
    "disappointed": -1.5, "broken": -1.5, "issue": -1,
    "terrible": -2, "worst": -2, "awful": -2, "rude": -2, "hate": -2,
}
_NEGATIONS = {"not", "never", "no", "isn't", "wasn't", "don't", "didn't"}
_TOKEN = re.compile(r"[a-z']+")


class LexiconScorer:
    def score(self, text: str) -> Optional[float]:
        tokens = _TOKEN.findall((text or "").lower())
        total, matched = 0.0, 0
        for i, tok in enumerate(tokens):
            w = _WEIGHTS.get(tok)
            if w is None:
                continue
            if i > 0 and tokens[i - 1] in _NEGATIONS:
                w = -w
            total += w
            matched += 1
        if matched == 0:
            return None  # unknown, not neutral: do not invent data
        return math.tanh(total / 2.0)


_SENTIMENT_SYSTEM_PROMPT = """You are a sentiment analyzer for customer feedback.
Return ONLY a single number between -1.0 and 1.0 representing sentiment.
-1.0 = extremely negative, 0 = neutral, 1.0 = extremely positive.
If sentiment cannot be determined, return "UNKNOWN".
Do not include any explanation, just the number or UNKNOWN."""


class OllamaSentimentScorer:
    """LLM-backed sentiment scorer using local Ollama."""

    def __init__(self, model: Optional[str] = None, base_url: Optional[str] = None):
        from .llm_client import get_ollama_client
        self._client = get_ollama_client()
        if model:
            self._client.model = model
        if base_url:
            self._client.base_url = base_url.rstrip("/")

    def score(self, text: str) -> Optional[float]:
        """Synchronous wrapper for async score_async."""
        import asyncio
        try:
            loop = asyncio.get_event_loop()
        except RuntimeError:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
        return loop.run_until_complete(self.score_async(text))

    async def score_async(self, text: str) -> Optional[float]:
        """Score text sentiment using Ollama LLM."""
        if not text or not text.strip():
            return None

        prompt = f"Analyze sentiment of this customer comment:\n\n\"{text.strip()}\""

        try:
            resp = await self._client.generate(
                prompt=prompt,
                system=_SENTIMENT_SYSTEM_PROMPT,
                temperature=0.1,
                max_tokens=20,
            )
            if resp is None:
                return None

            resp = resp.strip().upper()
            if resp == "UNKNOWN":
                return None

            val = float(resp)
            return max(-1.0, min(1.0, val))
        except (ValueError, Exception):
            return None


class HybridSentimentScorer:
    """Hybrid scorer: tries LLM first, falls back to lexicon."""

    def __init__(self, llm_scorer: Optional[OllamaSentimentScorer] = None):
        self.llm = llm_scorer or OllamaSentimentScorer()
        self.lexicon = LexiconScorer()

    def score(self, text: str) -> Optional[float]:
        """Sync score - uses lexicon only (fast, no event loop issues).
        For LLM scoring, use score_async() directly in async context."""
        return self.lexicon.score(text)

    async def score_async(self, text: str) -> Optional[float]:
        llm_result = await self.llm.score_async(text)
        if llm_result is not None:
            return llm_result
        return self.lexicon.score(text)

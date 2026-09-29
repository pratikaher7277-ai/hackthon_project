"""Core data models shared by all three parts of the pipeline."""
from __future__ import annotations

import math
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Any, Optional


class Channel(str, Enum):
    """The five ways company X interacts with customers (A-E in the design sketch)."""
    INSTAGRAM = "instagram"          # A
    WEBSITE = "website"              # B
    CAMPAIGNS = "campaigns"          # C
    MOBILE_APP = "mobile_app"        # D
    BLOGS_OFFLINE = "blogs_offline"  # E


CHANNEL_CODES = {
    Channel.INSTAGRAM: "A",
    Channel.WEBSITE: "B",
    Channel.CAMPAIGNS: "C",
    Channel.MOBILE_APP: "D",
    Channel.BLOGS_OFFLINE: "E",
}

CHANNEL_LABELS = {
    Channel.INSTAGRAM: "Instagram",
    Channel.WEBSITE: "Website",
    Channel.CAMPAIGNS: "Campaigns",
    Channel.MOBILE_APP: "Mobile App",
    Channel.BLOGS_OFFLINE: "Blogs / Offline",
}


@dataclass(frozen=True)
class ScaleSpec:
    """Native satisfaction scale of a channel; maps values linearly onto 0..1.

    Out-of-range or NaN values are treated as invalid (None), not clamped, so
    bad data shows up in the completeness check instead of silently shifting means.
    """
    lo: float
    hi: float

    def normalize(self, value: Optional[float]) -> Optional[float]:
        if value is None:
            return None
        if isinstance(value, float) and math.isnan(value):
            return None
        if value < self.lo or value > self.hi:
            return None
        return (value - self.lo) / (self.hi - self.lo)


# Each channel reports satisfaction differently. Linear mapping is an approximation
# (see docs/EVALUATION.md, limitation L2).
DEFAULT_SCALES = {
    Channel.INSTAGRAM: ScaleSpec(-1.0, 1.0),   # sentiment of comments/DMs
    Channel.WEBSITE: ScaleSpec(1.0, 5.0),      # post-visit star survey
    Channel.CAMPAIGNS: ScaleSpec(0.0, 10.0),   # NPS-style 0-10 response
    Channel.MOBILE_APP: ScaleSpec(1.0, 5.0),   # in-app rating
    Channel.BLOGS_OFFLINE: ScaleSpec(0.0, 1.0),  # thumbs up / down
}


@dataclass
class RawRecord:
    """What a connector returns, in the channel's own format."""
    channel: Channel
    customer_id: Optional[str]
    timestamp: Optional[datetime]
    score: Optional[float] = None      # native-scale rating, if the channel has one
    text: Optional[str] = None         # free text, if the channel only has text
    meta: dict[str, Any] = field(default_factory=dict)


@dataclass
class Interaction:
    """Normalised record: satisfaction is 0..1 or None when it could not be derived."""
    channel: Channel
    customer_id: Optional[str]
    timestamp: Optional[datetime]
    satisfaction: Optional[float]

    @property
    def is_complete(self) -> bool:
        return (self.satisfaction is not None
                and self.customer_id is not None
                and self.timestamp is not None)


@dataclass
class ChannelSnapshot:
    """Result of one agent scanning one channel."""
    channel: Channel
    interactions: list[Interaction]
    scanned_at: datetime
    ok: bool
    error: Optional[str] = None
    duration_s: float = 0.0
    attempts: int = 1

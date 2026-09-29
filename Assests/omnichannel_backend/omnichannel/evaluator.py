"""Part B - data comparing / evaluation system.

Two stages, matching the design ("compare through check parameters, then pick the data with
higher customer satisfaction"):

  1. CHECKS   - reliability (sample size), freshness, completeness -> eligibility gate.
  2. RANKING  - eligible channels ranked by small-sample-adjusted satisfaction.

Extras that address weaknesses of ranking on raw averages:
  * Bayesian shrinkage pulls small samples toward the pooled mean.
  * A significance test says whether the winner really beats the runner-up.
  * A like-for-like effect compares channels using the SAME customers, controlling for
    the fact that different channels attract different audiences.
"""
from __future__ import annotations

import math
import statistics
from collections import defaultdict
from dataclasses import dataclass, field
from datetime import date, datetime, timedelta
from typing import Optional, Sequence

from .models import Channel, ChannelSnapshot


@dataclass
class EvalConfig:
    quality_weights: dict[str, float] = field(default_factory=lambda: {
        "reliability": 0.4, "freshness": 0.3, "completeness": 0.3})
    prior_strength: float = 20.0       # pseudo-observations pulling toward the pooled mean
    min_samples: int = 30              # scored responses needed for full reliability
    min_completeness: float = 0.8      # gate
    min_freshness: float = 0.5         # gate
    max_staleness_hours: float = 24.0  # newest record older than this -> freshness 0
    z: float = 1.96                    # 95% interval / significance
    min_overlap_customers: int = 10    # for like-for-like effect
    gap_alert_points: float = 10.0     # flag if best-worst gap exceeds this many points

    def __post_init__(self) -> None:
        keys = {"reliability", "freshness", "completeness"}
        if set(self.quality_weights) != keys:
            raise ValueError(f"quality_weights must have keys {sorted(keys)}")
        if abs(sum(self.quality_weights.values()) - 1.0) > 1e-9:
            raise ValueError("quality_weights must sum to 1")


@dataclass
class ChannelEvaluation:
    channel: Channel
    status: str                    # "ok" | "failed"
    responses: int
    scored: int
    raw_mean: Optional[float]      # 0..1
    adjusted_mean: Optional[float]
    ci_low: Optional[float]
    ci_high: Optional[float]
    reliability: float
    freshness: float
    completeness: float
    quality_score: float           # 0..1 weighted
    eligible: bool
    reasons: list[str]
    rank: Optional[int] = None
    like_for_like_effect: Optional[float] = None  # 0..1 units, relative to same customers
    # Enhanced fields
    sample_size_category: str = ""  # "small", "medium", "large"
    confidence_level: float = 0.95
    trend_direction: Optional[str] = None  # "improving", "declining", "stable"
    statistical_power: Optional[float] = None


@dataclass
class Report:
    generated_at: datetime
    window_start: datetime
    window_end: datetime
    channels: list[ChannelEvaluation]
    best_channel: Optional[Channel]
    significant_lead: Optional[bool]
    pooled_mean: Optional[float]
    channel_gap_points: Optional[float]
    notes: list[str]


def _clip01(x: float) -> float:
    return max(0.0, min(1.0, x))


def _sample_size_category(k: int, min_samples: int) -> str:
    """Categorize sample size for interpretation."""
    if k < min_samples * 0.5:
        return "small"
    elif k < min_samples * 2:
        return "medium"
    else:
        return "large"


def _statistical_power(k: int, effect_size: float, alpha: float = 0.05) -> float:
    """Approximate statistical power for detecting an effect."""
    if k < 2 or effect_size <= 0:
        return 0.0
    # Simplified power calculation using normal approximation
    z_alpha = 1.96  # for alpha=0.05 two-tailed
    z_beta = (effect_size * math.sqrt(k)) - z_alpha
    return _clip01(0.5 + 0.5 * math.erf(z_beta / math.sqrt(2)))


def _trend_direction(bucket_means: list[Optional[float]]) -> Optional[str]:
    """Determine trend direction from bucketed means."""
    valid = [(i, m) for i, m in enumerate(bucket_means) if m is not None]
    if len(valid) < 3:
        return None
    # Simple linear regression slope
    x = [i for i, _ in valid]
    y = [m for _, m in valid]
    n = len(x)
    x_mean = sum(x) / n
    y_mean = sum(y) / n
    numerator = sum((x[i] - x_mean) * (y[i] - y_mean) for i in range(n))
    denominator = sum((x[i] - x_mean) ** 2 for i in range(n))
    if denominator == 0:
        return "stable"
    slope = numerator / denominator
    if slope > 0.005:
        return "improving"
    elif slope < -0.005:
        return "declining"
    else:
        return "stable"


def naive_best_channel(snapshots: Sequence[ChannelSnapshot]) -> Optional[Channel]:
    """The baseline logic from the original sketch: highest raw average wins."""
    best, best_mean = None, -1.0
    for s in snapshots:
        vals = [i.satisfaction for i in s.interactions if i.satisfaction is not None]
        if s.ok and vals and statistics.fmean(vals) > best_mean:
            best, best_mean = s.channel, statistics.fmean(vals)
    return best


def _like_for_like(snapshots: Sequence[ChannelSnapshot], cfg: EvalConfig) -> dict[Channel, float]:
    per: dict[str, dict[Channel, list[float]]] = defaultdict(lambda: defaultdict(list))
    for s in snapshots:
        if not s.ok:
            continue
        for i in s.interactions:
            if i.satisfaction is not None and i.customer_id is not None:
                per[i.customer_id][s.channel].append(i.satisfaction)
    effects: dict[Channel, list[float]] = defaultdict(list)
    for chs in per.values():
        if len(chs) < 2:
            continue
        means = {c: statistics.fmean(v) for c, v in chs.items()}
        overall = statistics.fmean(means.values())
        for c, m in means.items():
            effects[c].append(m - overall)
    return {c: statistics.fmean(v) for c, v in effects.items()
            if len(v) >= cfg.min_overlap_customers}


def evaluate(snapshots: Sequence[ChannelSnapshot], *, now: datetime,
             window_start: datetime, config: Optional[EvalConfig] = None,
             bucket_days: int = 1) -> Report:
    cfg = config or EvalConfig()
    ok_vals = [i.satisfaction for s in snapshots if s.ok
               for i in s.interactions if i.satisfaction is not None]
    pooled = statistics.fmean(ok_vals) if ok_vals else None
    pooled_sd = statistics.stdev(ok_vals) if len(ok_vals) >= 2 else 0.25
    lfl = _like_for_like(snapshots, cfg)
    
    # Get trend data for trend_direction
    _, trend_data = daily_trend(snapshots, window_start, now, bucket_days)
    
    notes: list[str] = []
    evals: list[ChannelEvaluation] = []
    ses: dict[Channel, float] = {}

    for s in snapshots:
        n = len(s.interactions)
        vals = [i.satisfaction for i in s.interactions if i.satisfaction is not None]
        k = len(vals)
        reasons: list[str] = []
        if not s.ok:
            evals.append(ChannelEvaluation(s.channel, "failed", 0, 0, None, None, None, None,
                                           0.0, 0.0, 0.0, 0.0, False,
                                           [f"scan failed: {s.error}"]))
            continue

        raw = statistics.fmean(vals) if vals else None
        adjusted = ci_low = ci_high = None
        if raw is not None and pooled is not None:
            adjusted = (k * raw + cfg.prior_strength * pooled) / (k + cfg.prior_strength)
            sd = statistics.stdev(vals) if k >= 2 else pooled_sd
            se = sd / math.sqrt(k + cfg.prior_strength)
            ses[s.channel] = se
            ci_low, ci_high = adjusted - cfg.z * se, adjusted + cfg.z * se

        reliability = _clip01(k / cfg.min_samples)
        stamps = [i.timestamp for i in s.interactions if i.timestamp is not None]
        if stamps:
            age_h = (now - max(stamps)).total_seconds() / 3600.0
            freshness = _clip01(1.0 - age_h / cfg.max_staleness_hours)
        else:
            freshness = 0.0
        completeness = (sum(1 for i in s.interactions if i.is_complete) / n) if n else 0.0
        w = cfg.quality_weights
        quality = w["reliability"] * reliability + w["freshness"] * freshness \
            + w["completeness"] * completeness

        if k < cfg.min_samples:
            reasons.append(f"only {k} scored responses (needs {cfg.min_samples})")
        if completeness < cfg.min_completeness:
            reasons.append(f"completeness {completeness:.0%} below {cfg.min_completeness:.0%}")
        if freshness < cfg.min_freshness:
            reasons.append(f"data too stale (freshness {freshness:.0%})")

        # Enhanced fields
        sample_cat = _sample_size_category(k, cfg.min_samples)
        trend = None
        if s.channel in trend_data:
            trend = _trend_direction([m for m, _ in trend_data[s.channel]])
        power = None
        if k >= 2 and pooled is not None and raw is not None:
            effect_size = abs(raw - pooled)
            power = _statistical_power(k, effect_size)

        evals.append(ChannelEvaluation(
            s.channel, "ok", n, k, raw, adjusted, ci_low, ci_high, reliability, freshness,
            completeness, quality, eligible=not reasons, reasons=reasons,
            like_for_like_effect=lfl.get(s.channel),
            sample_size_category=sample_cat,
            confidence_level=0.95,
            trend_direction=trend,
            statistical_power=power))

    eligible = sorted((e for e in evals if e.eligible and e.adjusted_mean is not None),
                      key=lambda e: e.adjusted_mean, reverse=True)
    for r, e in enumerate(eligible, start=1):
        e.rank = r

    best = eligible[0].channel if eligible else None
    significant: Optional[bool] = None
    gap: Optional[float] = None
    if len(eligible) >= 2:
        a, b = eligible[0], eligible[1]
        diff = a.adjusted_mean - b.adjusted_mean
        se_diff = math.sqrt(ses[a.channel] ** 2 + ses[b.channel] ** 2)
        significant = diff > cfg.z * se_diff
        if not significant:
            notes.append(f"{a.channel.value} does not clearly beat {b.channel.value}: "
                         f"difference {diff * 100:.1f} pts is within noise")
        gap = (eligible[0].adjusted_mean - eligible[-1].adjusted_mean) * 100
        if gap > cfg.gap_alert_points:
            notes.append(f"channel gap of {gap:.1f} pts exceeds {cfg.gap_alert_points:.0f}: "
                         "experience is inconsistent across channels")
    elif len(eligible) == 1:
        notes.append("only one channel passed the checks; no comparison possible")
    else:
        notes.append("no channel passed the data checks; no best channel selected")

    for e in evals:
        if not e.eligible:
            notes.append(f"{e.channel.value} excluded from ranking: {'; '.join(e.reasons)}")

    return Report(now, window_start, now, evals, best, significant, pooled, gap, notes)


def daily_trend(snapshots: Sequence[ChannelSnapshot], window_start: datetime,
                window_end: datetime, bucket_days: int = 1) -> tuple[list[date], dict[Channel, list[tuple[Optional[float], int]]]]:
    """Mean satisfaction per time bucket and channel: [(mean or None, n)]."""
    total_days = max(1, math.ceil((window_end - window_start).total_seconds() / 86400))
    nb = max(1, math.ceil(total_days / bucket_days))
    starts = [(window_start + timedelta(days=bucket_days * b)).date() for b in range(nb)]
    out: dict[Channel, list[tuple[Optional[float], int]]] = {}
    for s in snapshots:
        buckets: list[list[float]] = [[] for _ in range(nb)]
        for i in s.interactions:
            if i.satisfaction is None or i.timestamp is None:
                continue
            idx = int((i.timestamp - window_start).total_seconds() // (86400 * bucket_days))
            if 0 <= idx < nb:
                buckets[idx].append(i.satisfaction)
        out[s.channel] = [(statistics.fmean(b) if b else None, len(b)) for b in buckets]
    return starts, out


def format_ranking(report: Report) -> str:
    """Format a human-readable ranking table."""
    lines = []
    lines.append("=" * 80)
    lines.append("CHANNEL SATISFACTION RANKING")
    lines.append("=" * 80)
    lines.append(f"{'Rank':>4} {'Channel':<18} {'n':>5} {'k':>5} {'Raw%':>7} {'Adj%':>7} {'CI (95%)':>15} {'Quality':>7} {'Trend':>10} {'Power':>6} {'Status'}")
    lines.append("-" * 80)
    
    for e in sorted(report.channels, key=lambda x: (x.rank or 999, x.channel.value)):
        rank_str = str(e.rank) if e.rank else "—"
        raw_str = f"{e.raw_mean*100:.1f}" if e.raw_mean is not None else "N/A"
        adj_str = f"{e.adjusted_mean*100:.1f}" if e.adjusted_mean is not None else "N/A"
        ci_str = f"[{e.ci_low*100:.1f}, {e.ci_high*100:.1f}]" if e.ci_low is not None else "N/A"
        quality_str = f"{e.quality_score*100:.1f}%"
        trend_str = e.trend_direction or "N/A"
        power_str = f"{e.statistical_power*100:.0f}%" if e.statistical_power is not None else "N/A"
        status = "✅ ELIGIBLE" if e.eligible else f"❌ {e.reasons[0] if e.reasons else 'INELIGIBLE'}"
        
        lines.append(f"{rank_str:>4} {e.channel.value:<18} {e.responses:>5} {e.scored:>5} {raw_str:>7} {adj_str:>7} {ci_str:>15} {quality_str:>7} {trend_str:>10} {power_str:>6} {status}")
    
    lines.append("-" * 80)
    lines.append(f"Best Channel: {report.best_channel.value if report.best_channel else 'None'}")
    lines.append(f"Significant Lead: {'Yes' if report.significant_lead else 'No' if report.significant_lead is not None else 'N/A'}")
    lines.append(f"Channel Gap: {report.channel_gap_points:.1f} pts" if report.channel_gap_points else "Channel Gap: N/A")
    lines.append(f"Pooled Satisfaction: {report.pooled_mean*100:.1f}%" if report.pooled_mean else "Pooled Satisfaction: N/A")
    
    if report.notes:
        lines.append("\nNotes:")
        for note in report.notes:
            lines.append(f"  • {note}")
    
    lines.append("=" * 80)
    return "\n".join(lines)


def get_ranking_data(report: Report) -> list[dict]:
    """Get ranking as structured data for API/frontend."""
    result = []
    for e in sorted(report.channels, key=lambda x: (x.rank or 999, x.channel.value)):
        result.append({
            "rank": e.rank,
            "channel": e.channel.value,
            "channel_code": e.channel.value[0].upper(),  # A, B, C, D, E
            "label": e.channel.value.replace("_", " ").title(),
            "responses": e.responses,
            "scored_responses": e.scored,
            "raw_satisfaction_pct": round(e.raw_mean * 100, 1) if e.raw_mean else None,
            "adjusted_satisfaction_pct": round(e.adjusted_mean * 100, 1) if e.adjusted_mean else None,
            "ci_low_pct": round(e.ci_low * 100, 1) if e.ci_low else None,
            "ci_high_pct": round(e.ci_high * 100, 1) if e.ci_high else None,
            "reliability_pct": round(e.reliability * 100, 1),
            "freshness_pct": round(e.freshness * 100, 1),
            "completeness_pct": round(e.completeness * 100, 1),
            "quality_score_pct": round(e.quality_score * 100, 1),
            "sample_size_category": e.sample_size_category,
            "trend_direction": e.trend_direction,
            "statistical_power_pct": round(e.statistical_power * 100, 1) if e.statistical_power else None,
            "like_for_like_effect_pts": round(e.like_for_like_effect * 100, 1) if e.like_for_like_effect else None,
            "eligible": e.eligible,
            "reasons": e.reasons,
            "status": e.status,
        })
    return result

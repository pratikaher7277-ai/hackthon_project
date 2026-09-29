"""Part C - transfer to frontend: build a chart-ready JSON payload.

The payload is library-neutral (bar / grouped_bar / line) and maps directly onto Chart.js,
Recharts or ECharts datasets. All satisfaction values are percentages 0-100, one decimal.
"""
from __future__ import annotations

from datetime import date
from typing import Any, Optional

from .evaluator import Report
from .models import CHANNEL_CODES, CHANNEL_LABELS, Channel

SCHEMA_VERSION = "1.0"


def _pct(x: Optional[float]) -> Optional[float]:
    return None if x is None else round(x * 100, 1)


def _label(c: Channel) -> str:
    return f"{CHANNEL_CODES[c]} {CHANNEL_LABELS[c]}"


def build_payload(report: Report, trend_dates: list[date],
                  trend: dict[Channel, list[tuple[Optional[float], int]]]) -> dict[str, Any]:
    chans = report.channels
    channel_rows = []
    for e in chans:
        channel_rows.append({
            "key": e.channel.value,
            "code": CHANNEL_CODES[e.channel],
            "label": CHANNEL_LABELS[e.channel],
            "status": e.status,
            "eligible": e.eligible,
            "rank": e.rank,
            "responses": e.responses,
            "scored_responses": e.scored,
            "raw_satisfaction_pct": _pct(e.raw_mean),
            "adjusted_satisfaction_pct": _pct(e.adjusted_mean),
            "ci_low_pct": _pct(e.ci_low),
            "ci_high_pct": _pct(e.ci_high),
            "like_for_like_effect_pts": None if e.like_for_like_effect is None
            else round(e.like_for_like_effect * 100, 1),
            "data_quality": {
                "reliability_pct": _pct(e.reliability),
                "freshness_pct": _pct(e.freshness),
                "completeness_pct": _pct(e.completeness),
                "score_pct": _pct(e.quality_score),
            },
            "reasons": e.reasons,
        })

    labels = [_label(e.channel) for e in chans]
    best_idx = next((i for i, e in enumerate(chans) if e.channel == report.best_channel), None)
    charts = [
        {"id": "satisfaction_by_channel", "type": "bar",
         "title": "Customer satisfaction by channel (adjusted)", "unit": "%",
         "x": labels,
         "series": [{"name": "Adjusted satisfaction", "data": [_pct(e.adjusted_mean) for e in chans]}],
         "error": {"low": [_pct(e.ci_low) for e in chans], "high": [_pct(e.ci_high) for e in chans]},
         "eligible": [e.eligible for e in chans],
         "highlight": best_idx},
        {"id": "data_quality_breakdown", "type": "grouped_bar",
         "title": "Data quality checks by channel", "unit": "%",
         "x": labels,
         "series": [
             {"name": "Reliability", "data": [_pct(e.reliability) for e in chans]},
             {"name": "Freshness", "data": [_pct(e.freshness) for e in chans]},
             {"name": "Completeness", "data": [_pct(e.completeness) for e in chans]}]},
        {"id": "satisfaction_trend", "type": "line",
         "title": "Satisfaction trend", "unit": "%",
         "x": [d.isoformat() for d in trend_dates],
         "series": [{"name": _label(e.channel),
                     "data": [_pct(m) for m, _n in trend.get(e.channel, [])]} for e in chans]},
    ]

    best = report.best_channel
    return {
        "schema_version": SCHEMA_VERSION,
        "generated_at": report.generated_at.isoformat(),
        "window": {"start": report.window_start.isoformat(), "end": report.window_end.isoformat()},
        "summary": {
            "best_channel": None if best is None else {
                "key": best.value, "code": CHANNEL_CODES[best], "label": CHANNEL_LABELS[best]},
            "significant_lead": report.significant_lead,
            "channel_gap_points": None if report.channel_gap_points is None
            else round(report.channel_gap_points, 1),
            "pooled_satisfaction_pct": _pct(report.pooled_mean),
            "notes": report.notes,
        },
        "channels": channel_rows,
        "charts": charts,
    }

"""Orchestrates Part A -> Part B -> Part C."""
from __future__ import annotations

import os
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from typing import Any, Optional, Sequence

from .agents import ChannelAgent, scan_all
from .evaluator import EvalConfig, Report, daily_trend, evaluate
from .models import ChannelSnapshot
from .presenter import build_payload
from .simulation import build_simulated_agents


@dataclass
class PipelineResult:
    snapshots: list[ChannelSnapshot]
    report: Report
    payload: dict[str, Any]


async def run_pipeline(agents: Sequence[ChannelAgent], *, days: int = 14, bucket_days: int = 1,
                       config: Optional[EvalConfig] = None,
                       now: Optional[datetime] = None) -> PipelineResult:
    now = now or datetime.now(timezone.utc)
    since = now - timedelta(days=days)
    snapshots = await scan_all(agents, since, now)                       # Part A
    report = evaluate(snapshots, now=now, window_start=since, config=config, bucket_days=bucket_days)  # Part B
    dates, trend = daily_trend(snapshots, since, now, bucket_days)       # Part C
    payload = build_payload(report, dates, trend)
    return PipelineResult(snapshots, report, payload)


def agents_from_env() -> list[ChannelAgent]:
    """OMNI_MODE=simulated (default). For real data, build ChannelAgents with your own
    Connectors and pass them to create_app(agent_factory=...)."""
    mode = os.getenv("OMNI_MODE", "simulated")
    if mode == "simulated":
        return build_simulated_agents()
    raise RuntimeError(f"OMNI_MODE={mode!r}: no real connectors are bundled; "
                       "implement agents.Connector and pass an agent_factory to create_app().")

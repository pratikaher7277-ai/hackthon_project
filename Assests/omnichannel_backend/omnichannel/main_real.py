"""Real-data entry point: python -m omnichannel.main_real [--days 14] [--out sample_output]

Uses real connectors (configured via env vars) and LLM sentiment scorer for Instagram.
"""
from __future__ import annotations

import argparse
import asyncio
import json
import os
from pathlib import Path

from .agents import ChannelAgent
from .connectors import (
    InstagramConnector,
    WebsiteSurveyConnector,
    CampaignsConnector,
    MobileAppConnector,
    BlogsOfflineConnector,
    create_mock_connectors,
)
from .llm_client import close_ollama_client
from .pipeline import run_pipeline
from .sentiment import HybridSentimentScorer, OllamaSentimentScorer
from .svg import render_bar_svg


def build_real_agents(use_mock: bool = False) -> list[ChannelAgent]:
    """Build ChannelAgents with real connectors and LLM sentiment scorer."""
    from .models import Channel

    if use_mock:
        mocks = create_mock_connectors()
        return [
            ChannelAgent(
                channel,
                mocks[channel],
                scorer=HybridSentimentScorer() if channel == Channel.INSTAGRAM else None,
            )
            for channel in Channel
        ]

    sentiment_scorer = HybridSentimentScorer()

    agents = [
        ChannelAgent(
            Channel.INSTAGRAM,
            InstagramConnector(),
            scorer=sentiment_scorer,
        ),
        ChannelAgent(
            Channel.WEBSITE,
            WebsiteSurveyConnector(),
        ),
        ChannelAgent(
            Channel.CAMPAIGNS,
            CampaignsConnector(),
        ),
        ChannelAgent(
            Channel.MOBILE_APP,
            MobileAppConnector(),
        ),
        ChannelAgent(
            Channel.BLOGS_OFFLINE,
            BlogsOfflineConnector(),
        ),
    ]
    return agents


def build_app_factory(use_mock: bool = False):
    """Create agent factory for FastAPI app."""
    def factory():
        return build_real_agents(use_mock=use_mock)
    return factory


async def run_and_save(days: int = 14, bucket_days: int = 1, out: str = "sample_output", use_mock: bool = False):
    """Run pipeline with real agents and save results."""
    agents = build_real_agents(use_mock=use_mock)
    result = await run_pipeline(agents, days=days, bucket_days=bucket_days)

    out_path = Path(out)
    out_path.mkdir(parents=True, exist_ok=True)
    (out_path / "report.json").write_text(json.dumps(result.payload, indent=2))
    (out_path / "report_bar.svg").write_text(render_bar_svg(result.payload))

    s = result.payload["summary"]
    print(f"\n=== Omnichannel Satisfaction Report ===")
    print(f"Window: {days} days, Bucket: {bucket_days} day(s)")
    print(f"Best channel: {s['best_channel']['label'] if s['best_channel'] else 'none'} "
          f"(significant lead: {s['significant_lead']})")
    print(f"Pooled satisfaction: {s['pooled_satisfaction_pct']}%")
    print(f"Channel gap: {s['channel_gap_points']} points")
    print(f"\n{'channel':<18}{'n':>5}{'raw%':>8}{'adj%':>8}  eligible  reasons")
    for c in result.payload["channels"]:
        print(f"{c['code']} {c['label']:<15}{c['scored_responses']:>5}"
              f"{str(c['raw_satisfaction_pct']):>8}{str(c['adjusted_satisfaction_pct']):>8}  "
              f"{str(c['eligible']):<9} {'; '.join(c['reasons'])}")
    for n in s["notes"]:
        print(f"note: {n}")
    print(f"\nWrote {out_path}/report.json and report_bar.svg")

    await close_ollama_client()
    return result


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--days", type=int, default=14)
    ap.add_argument("--bucket-days", type=int, default=1)
    ap.add_argument("--out", default="sample_output")
    ap.add_argument("--mock", action="store_true", help="Use mock connectors for testing")
    args = ap.parse_args()

    asyncio.run(run_and_save(args.days, args.bucket_days, args.out, use_mock=args.mock))


if __name__ == "__main__":
    main()
"""Monte-Carlo evaluation of the evaluator against simulated ground truth.

Compares the original logic (highest raw average wins) with the proposed two-stage evaluator.
Run:  python scripts/evaluate.py [--seeds 300]
"""
import argparse
import asyncio
import sys
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from omnichannel.evaluator import naive_best_channel
from omnichannel.models import Channel
from omnichannel.pipeline import run_pipeline
from omnichannel.simulation import ChannelSimSpec, build_simulated_agents, true_channel_means

NOW = datetime(2026, 9, 29, 12, 0, tzinfo=timezone.utc)


def base_specs(tiny_effect):
    return [
        ChannelSimSpec(Channel.INSTAGRAM, 220, effect=-0.03, noise_sd=0.15),
        ChannelSimSpec(Channel.WEBSITE, 310, effect=0.04),
        ChannelSimSpec(Channel.CAMPAIGNS, 140, effect=-0.06, missing_rate=0.05),
        ChannelSimSpec(Channel.MOBILE_APP, 260, effect=0.07),
        ChannelSimSpec(Channel.BLOGS_OFFLINE, 12, effect=tiny_effect, noise_sd=0.2),
    ]


def run(specs, seeds):
    truth = None
    naive_hits = prop_hits = naive_tiny = prop_none = prop_sig = 0
    for seed in range(seeds):
        agents = build_simulated_agents(specs, seed=seed)
        res = asyncio.run(run_pipeline(agents, days=14, now=NOW))
        truth = true_channel_means(specs, seed=seed)
        true_best = max(truth, key=truth.get)
        nb = naive_best_channel(res.snapshots)
        pb = res.report.best_channel
        naive_hits += nb is true_best
        prop_hits += pb is true_best
        naive_tiny += nb is Channel.BLOGS_OFFLINE
        prop_none += pb is None
        prop_sig += bool(res.report.significant_lead)
    return dict(seeds=seeds, naive_correct=naive_hits / seeds, proposed_correct=prop_hits / seeds,
                naive_picks_tiny=naive_tiny / seeds, proposed_no_pick=prop_none / seeds,
                proposed_significant_lead=prop_sig / seeds)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--seeds", type=int, default=300)
    a = ap.parse_args()
    scenarios = {
        "S1: tiny channel E is truly WORSE (effect -0.05)": base_specs(-0.05),
        "S2: tiny channel E is truly BEST  (effect +0.25)": base_specs(+0.25),
        "S3: tiny channel E truly average  (effect  0.00)": base_specs(0.0),
    }
    for name, specs in scenarios.items():
        r = run(specs, a.seeds)
        print(name)
        print(f"  original logic picks the true best channel : {r['naive_correct']:.1%}")
        print(f"  proposed evaluator picks the true best     : {r['proposed_correct']:.1%}")
        print(f"  original logic picks tiny channel E        : {r['naive_picks_tiny']:.1%}")
        print(f"  proposed evaluator picks nothing           : {r['proposed_no_pick']:.1%}")
        print(f"  proposed says lead is statistically real   : {r['proposed_significant_lead']:.1%}")
        print()


if __name__ == "__main__":
    main()

"""CLI demo: python -m omnichannel [--days 14] [--out sample_output]"""
from __future__ import annotations

import argparse
import asyncio
import json
from pathlib import Path

from .pipeline import agents_from_env, run_pipeline
from .svg import render_bar_svg


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--days", type=int, default=14)
    ap.add_argument("--bucket-days", type=int, default=1)
    ap.add_argument("--out", default="sample_output")
    args = ap.parse_args()

    result = asyncio.run(run_pipeline(agents_from_env(), days=args.days, bucket_days=args.bucket_days))
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    (out / "report.json").write_text(json.dumps(result.payload, indent=2))
    (out / "report_bar.svg").write_text(render_bar_svg(result.payload))

    s = result.payload["summary"]
    print(f"Best channel: {s['best_channel']['label'] if s['best_channel'] else 'none'} "
          f"(significant lead: {s['significant_lead']})")
    print(f"{'channel':<18}{'n':>5}{'raw%':>8}{'adj%':>8}  eligible  reasons")
    for c in result.payload["channels"]:
        print(f"{c['code']} {c['label']:<15}{c['scored_responses']:>5}"
              f"{str(c['raw_satisfaction_pct']):>8}{str(c['adjusted_satisfaction_pct']):>8}  "
              f"{str(c['eligible']):<9} {'; '.join(c['reasons'])}")
    for n in s["notes"]:
        print("note:", n)
    print(f"Wrote {out}/report.json and report_bar.svg")


if __name__ == "__main__":
    main()

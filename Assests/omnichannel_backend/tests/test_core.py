import asyncio
from datetime import datetime, timedelta, timezone

import pytest

from omnichannel.agents import ChannelAgent, scan_all
from omnichannel.evaluator import EvalConfig, evaluate, naive_best_channel
from omnichannel.models import Channel, ChannelSnapshot, Interaction, RawRecord, ScaleSpec
from omnichannel.pipeline import run_pipeline
from omnichannel.sentiment import LexiconScorer
from omnichannel.simulation import ChannelSimSpec, build_simulated_agents

NOW = datetime(2026, 9, 29, 12, 0, tzinfo=timezone.utc)


def snap(channel, values, *, age_h=1.0, ok=True):
    ints = [Interaction(channel, f"c{i}", NOW - timedelta(hours=age_h + i * 0.01), v)
            for i, v in enumerate(values)]
    return ChannelSnapshot(channel, ints, NOW, ok=ok)


def test_scale_normalizes_and_rejects_out_of_range():
    s = ScaleSpec(1, 5)
    assert s.normalize(1) == 0.0 and s.normalize(5) == 1.0 and s.normalize(3) == 0.5
    assert s.normalize(6) is None and s.normalize(None) is None and s.normalize(float("nan")) is None


def test_lexicon_scorer():
    sc = LexiconScorer()
    assert sc.score("love this, great service") > 0.9
    assert sc.score("terrible, worst experience") < -0.9
    assert sc.score("not good") < 0
    assert sc.score("hello there") is None


def test_agent_isolates_failures_and_retries():
    class Flaky:
        calls = 0
        async def fetch(self, since, until):
            Flaky.calls += 1
            if Flaky.calls < 2:
                raise ConnectionError("boom")
            return [RawRecord(Channel.WEBSITE, "c1", NOW, score=5)]

    class Dead:
        async def fetch(self, since, until):
            raise TimeoutError("down")

    agents = [ChannelAgent(Channel.WEBSITE, Flaky(), retries=2, backoff_s=0.001),
              ChannelAgent(Channel.MOBILE_APP, Dead(), retries=1, backoff_s=0.001)]
    snaps = asyncio.run(scan_all(agents, NOW - timedelta(days=1), NOW))
    assert snaps[0].ok and snaps[0].attempts == 2 and snaps[0].interactions[0].satisfaction == 1.0
    assert not snaps[1].ok and "TimeoutError" in snaps[1].error


def test_duplicate_channels_rejected():
    a = build_simulated_agents([ChannelSimSpec(Channel.WEBSITE, 5)])[0]
    with pytest.raises(ValueError):
        asyncio.run(scan_all([a, a], NOW - timedelta(days=1), NOW))


def test_small_sample_channel_is_gated_and_naive_is_fooled():
    big = snap(Channel.WEBSITE, [0.7, 0.75, 0.65] * 40)          # 120 responses, ~0.70
    tiny = snap(Channel.BLOGS_OFFLINE, [1.0, 1.0, 1.0, 0.9])     # 4 responses, ~0.98
    assert naive_best_channel([big, tiny]) is Channel.BLOGS_OFFLINE
    rep = evaluate([big, tiny], now=NOW, window_start=NOW - timedelta(days=7))
    assert rep.best_channel is Channel.WEBSITE
    tiny_eval = next(e for e in rep.channels if e.channel is Channel.BLOGS_OFFLINE)
    assert not tiny_eval.eligible and tiny_eval.adjusted_mean < 0.98  # shrunk toward pool


def test_stale_and_incomplete_channels_excluded():
    fresh = snap(Channel.WEBSITE, [0.8] * 50)
    stale = snap(Channel.MOBILE_APP, [0.9] * 50, age_h=30)
    holes = snap(Channel.CAMPAIGNS, [0.9] * 40 + [None] * 40)
    rep = evaluate([fresh, stale, holes], now=NOW, window_start=NOW - timedelta(days=7))
    ok = {e.channel: e.eligible for e in rep.channels}
    assert ok == {Channel.WEBSITE: True, Channel.MOBILE_APP: False, Channel.CAMPAIGNS: False}
    assert rep.best_channel is Channel.WEBSITE


def test_failed_channel_reported_not_ranked():
    good = snap(Channel.WEBSITE, [0.8] * 50)
    bad = ChannelSnapshot(Channel.MOBILE_APP, [], NOW, ok=False, error="ConnectionError: x")
    rep = evaluate([good, bad], now=NOW, window_start=NOW - timedelta(days=7))
    e = next(e for e in rep.channels if e.channel is Channel.MOBILE_APP)
    assert e.status == "failed" and not e.eligible and rep.best_channel is Channel.WEBSITE


def test_near_tie_not_significant_and_clear_win_significant():
    a = snap(Channel.WEBSITE, [0.70, 0.72, 0.68, 0.71] * 25)
    b = snap(Channel.MOBILE_APP, [0.70, 0.71, 0.69, 0.72] * 25)
    assert evaluate([a, b], now=NOW, window_start=NOW).significant_lead is False
    c = snap(Channel.MOBILE_APP, [0.40, 0.42, 0.38, 0.41] * 25)
    assert evaluate([a, c], now=NOW, window_start=NOW).significant_lead is True


def test_no_eligible_channel_gives_no_best():
    rep = evaluate([snap(Channel.WEBSITE, [0.9] * 3)], now=NOW, window_start=NOW)
    assert rep.best_channel is None and rep.significant_lead is None


def test_invalid_weights_rejected():
    with pytest.raises(ValueError):
        EvalConfig(quality_weights={"reliability": 0.5, "freshness": 0.5, "completeness": 0.5})


def test_like_for_like_recovers_channel_effect():
    # Same customers rate mobile 10 points higher than website.
    web, app = [], []
    for i in range(40):
        base = 0.5 + (i % 10) * 0.03
        web.append(Interaction(Channel.WEBSITE, f"u{i}", NOW - timedelta(hours=1), base))
        app.append(Interaction(Channel.MOBILE_APP, f"u{i}", NOW - timedelta(hours=1), base + 0.10))
    rep = evaluate([ChannelSnapshot(Channel.WEBSITE, web, NOW, True),
                    ChannelSnapshot(Channel.MOBILE_APP, app, NOW, True)],
                   now=NOW, window_start=NOW - timedelta(days=1))
    eff = {e.channel: e.like_for_like_effect for e in rep.channels}
    assert eff[Channel.MOBILE_APP] == pytest.approx(0.05, abs=1e-9)
    assert eff[Channel.WEBSITE] == pytest.approx(-0.05, abs=1e-9)


def test_pipeline_payload_shape_and_json_safe():
    import json
    res = asyncio.run(run_pipeline(build_simulated_agents(), days=14, now=NOW))
    p = res.payload
    assert p["schema_version"] == "1.0" and len(p["channels"]) == 5
    assert {c["id"] for c in p["charts"]} == {"satisfaction_by_channel", "data_quality_breakdown",
                                              "satisfaction_trend"}
    bar = p["charts"][0]
    assert len(bar["x"]) == len(bar["series"][0]["data"]) == len(bar["error"]["low"]) == 5
    assert len(p["charts"][2]["x"]) == 14
    json.dumps(p)  # must serialise
    assert p["summary"]["best_channel"]["key"] in {"website", "mobile_app"}


def test_pipeline_survives_outage():
    specs = [ChannelSimSpec(Channel.WEBSITE, 100), ChannelSimSpec(Channel.MOBILE_APP, 100, fail=True)]
    res = asyncio.run(run_pipeline(build_simulated_agents(specs), days=7, now=NOW))
    st = {c["key"]: c["status"] for c in res.payload["channels"]}
    assert st == {"website": "ok", "mobile_app": "failed"}
    assert res.payload["summary"]["best_channel"]["key"] == "website"

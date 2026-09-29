"""HTTP layer: the endpoints the frontend calls."""
from __future__ import annotations

import os
from pathlib import Path
from typing import Any, Callable, Optional, Sequence

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from .agents import ChannelAgent
from .models import CHANNEL_CODES, CHANNEL_LABELS, Channel
from .pipeline import agents_from_env, run_pipeline

_FRONTEND_DIST = Path(__file__).resolve().parent.parent / "frontend" / "dist"


def _default_origins() -> list[str]:
    default = "http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:5173"
    return [o.strip() for o in os.getenv("OMNI_CORS_ORIGINS", default).split(",") if o.strip()]


async def _build_report_payload(factory: Callable[[], Sequence[ChannelAgent]], days: int, bucket_days: int) -> dict[str, Any]:
    result = await run_pipeline(factory(), days=days, bucket_days=bucket_days)
    return result.payload


def create_app(agent_factory: Optional[Callable[[], Sequence[ChannelAgent]]] = None) -> FastAPI:
    factory = agent_factory or agents_from_env
    app = FastAPI(title="Omnichannel Satisfaction Backend", version="1.0.0")
    origins = _default_origins()
    app.add_middleware(CORSMiddleware, allow_origins=origins, allow_methods=["GET"],
                       allow_headers=["*"])

    @app.get("/health")
    def health() -> dict:
        return {"status": "ok"}

    @app.get("/api/v1/channels")
    def channels() -> list[dict]:
        return [{"key": c.value, "code": CHANNEL_CODES[c], "label": CHANNEL_LABELS[c]}
                for c in Channel]

    @app.get("/api/v1/report")
    async def report(days: int = Query(14, ge=1, le=90),
                     bucket_days: int = Query(1, ge=1, le=30)) -> dict:
        return await _build_report_payload(factory, days=days, bucket_days=bucket_days)

    @app.get("/api/v1/summary")
    async def summary(days: int = Query(14, ge=1, le=90),
                      bucket_days: int = Query(1, ge=1, le=30)) -> dict:
        payload = await _build_report_payload(factory, days=days, bucket_days=bucket_days)
        summary_payload = payload["summary"]
        return {
            "best_channel": summary_payload.get("best_channel"),
            "significant_lead": summary_payload.get("significant_lead"),
            "channel_gap_points": summary_payload.get("channel_gap_points"),
            "pooled_satisfaction_pct": summary_payload.get("pooled_satisfaction_pct"),
            "window": payload["window"],
            "generated_at": payload["generated_at"],
            "alert": bool(summary_payload.get("significant_lead")),
            "notes": summary_payload.get("notes", []),
        }

    @app.get("/api/v1/ranking")
    async def ranking(days: int = Query(14, ge=1, le=90),
                      bucket_days: int = Query(1, ge=1, le=30),
                      format: str = Query("json")) -> dict:
        payload = await _build_report_payload(factory, days=days, bucket_days=bucket_days)
        ranking = []
        for channel in payload.get("channels", []):
            quality = channel.get("data_quality", {})
            ranking.append({
                "rank": channel.get("rank"),
                "channel": channel.get("key"),
                "channel_code": channel.get("code"),
                "label": channel.get("label"),
                "responses": channel.get("responses", 0),
                "scored_responses": channel.get("scored_responses", 0),
                "raw_satisfaction_pct": channel.get("raw_satisfaction_pct"),
                "adjusted_satisfaction_pct": channel.get("adjusted_satisfaction_pct"),
                "ci_low_pct": channel.get("ci_low_pct"),
                "ci_high_pct": channel.get("ci_high_pct"),
                "reliability_pct": quality.get("reliability_pct"),
                "freshness_pct": quality.get("freshness_pct"),
                "completeness_pct": quality.get("completeness_pct"),
                "quality_score_pct": quality.get("score_pct"),
                "sample_size_category": "medium",
                "trend_direction": None,
                "statistical_power_pct": None,
                "like_for_like_effect_pts": channel.get("like_for_like_effect_pts"),
                "eligible": channel.get("eligible", False),
                "reasons": channel.get("reasons", []),
                "status": channel.get("status", "failed"),
            })
        ranking.sort(key=lambda x: (x["rank"] is None, x["rank"] if x["rank"] is not None else 999999))
        return {"ranking": ranking, "summary": payload["summary"]}

    @app.get("/api/v1/chart-types")
    async def chart_types() -> list[dict]:
        payload = await _build_report_payload(factory, days=14, bucket_days=1)
        return [
            {"id": chart["id"], "type": chart["type"], "description": chart["title"]}
            for chart in payload.get("charts", [])
        ]

    @app.get("/api/v1/chart/{chart_id}")
    async def chart(chart_id: str,
                    days: int = Query(14, ge=1, le=90),
                    bucket_days: int = Query(1, ge=1, le=30)) -> dict:
        payload = await _build_report_payload(factory, days=days, bucket_days=bucket_days)
        for chart in payload.get("charts", []):
            if chart.get("id") == chart_id:
                return chart
        raise HTTPException(status_code=404, detail="Chart not found")

    if _FRONTEND_DIST.exists():
        assets_dir = _FRONTEND_DIST / "assets"
        if assets_dir.exists():
            app.mount("/assets", StaticFiles(directory=str(assets_dir)), name="assets")

        @app.get("/{full_path:path}", include_in_schema=False)
        async def serve_spa(full_path: str) -> FileResponse:
            if full_path.startswith("api/") or full_path.startswith("health"):
                raise HTTPException(status_code=404)
            candidate = _FRONTEND_DIST / full_path
            if full_path and candidate.is_file():
                return FileResponse(str(candidate))
            return FileResponse(str(_FRONTEND_DIST / "index.html"))

    return app


app = create_app()

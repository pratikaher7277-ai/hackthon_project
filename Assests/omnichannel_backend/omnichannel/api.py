"""HTTP layer: the endpoints the frontend calls."""
from __future__ import annotations

import os
from typing import Callable, Optional, Sequence

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

from .agents import ChannelAgent
from .models import CHANNEL_CODES, CHANNEL_LABELS, Channel
from .pipeline import agents_from_env, run_pipeline


def create_app(agent_factory: Optional[Callable[[], Sequence[ChannelAgent]]] = None) -> FastAPI:
    factory = agent_factory or agents_from_env
    app = FastAPI(title="Omnichannel Satisfaction Backend", version="1.0.0")
    origins = [o.strip() for o in os.getenv("OMNI_CORS_ORIGINS", "http://localhost:3000").split(",")]
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
        result = await run_pipeline(factory(), days=days, bucket_days=bucket_days)
        return result.payload

    return app


app = create_app()

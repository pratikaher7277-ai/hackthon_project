"""Real channel connectors - implement these for your actual data sources."""
from __future__ import annotations

import os
from abc import ABC, abstractmethod
from datetime import datetime, timezone
from typing import Optional

import httpx

from .agents import Connector
from .models import Channel, RawRecord


class BaseHTTPConnector(Connector, ABC):
    """Base class for HTTP-based connectors with auth and retry logic."""

    def __init__(
        self,
        base_url: str,
        api_key: Optional[str] = None,
        timeout: float = 10.0,
    ):
        self.base_url = base_url.rstrip("/")
        self.api_key = api_key
        self.timeout = timeout
        self._client: Optional[httpx.AsyncClient] = None

    async def _get_client(self) -> httpx.AsyncClient:
        if self._client is None or self._client.is_closed:
            headers = {}
            if self.api_key:
                headers["Authorization"] = f"Bearer {self.api_key}"
            self._client = httpx.AsyncClient(
                base_url=self.base_url,
                headers=headers,
                timeout=self.timeout,
            )
        return self._client

    async def close(self):
        if self._client and not self._client.is_closed:
            await self._client.aclose()

    @abstractmethod
    async def fetch(self, since: datetime, until: datetime) -> list[RawRecord]:
        pass


class InstagramConnector(BaseHTTPConnector):
    """Instagram Graph API connector for comments/DMs."""

    def __init__(
        self,
        access_token: Optional[str] = None,
        business_account_id: Optional[str] = None,
        **kwargs,
    ):
        super().__init__("https://graph.facebook.com/v18.0", **kwargs)
        self.access_token = access_token or os.getenv("INSTAGRAM_ACCESS_TOKEN")
        self.business_account_id = business_account_id or os.getenv("INSTAGRAM_BUSINESS_ACCOUNT_ID")

    async def fetch(self, since: datetime, until: datetime) -> list[RawRecord]:
        if not self.access_token or not self.business_account_id:
            raise ValueError("Instagram credentials not configured")

        client = await self._get_client()
        since_ts = int(since.timestamp())
        until_ts = int(until.timestamp())

        url = f"/{self.business_account_id}/media"
        params = {
            "fields": "id,comments{id,text,timestamp,from{id}}",
            "since": since_ts,
            "until": until_ts,
            "access_token": self.access_token,
        }

        resp = await client.get(url, params=params)
        resp.raise_for_status()
        data = resp.json()

        records = []
        for media in data.get("data", []):
            for comment in media.get("comments", {}).get("data", []):
                try:
                    ts = datetime.fromisoformat(comment["timestamp"].replace("Z", "+00:00"))
                    records.append(RawRecord(
                        channel=Channel.INSTAGRAM,
                        customer_id=comment.get("from", {}).get("id"),
                        timestamp=ts,
                        text=comment.get("text"),
                    ))
                except Exception:
                    continue
        return records


class WebsiteSurveyConnector(BaseHTTPConnector):
    """Generic website survey connector (Qualtrics, SurveyMonkey, custom)."""

    def __init__(self, api_key: Optional[str] = None, survey_id: Optional[str] = None, **kwargs):
        super().__init__(**kwargs)
        self.api_key = api_key or os.getenv("WEBSITE_SURVEY_API_KEY")
        self.survey_id = survey_id or os.getenv("WEBSITE_SURVEY_ID")

    async def fetch(self, since: datetime, until: datetime) -> list[RawRecord]:
        client = await self._get_client()
        since_iso = since.isoformat()
        until_iso = until.isoformat()

        resp = await client.get(
            f"/surveys/{self.survey_id}/responses",
            params={"since": since_iso, "until": until_iso},
        )
        resp.raise_for_status()
        data = resp.json()

        records = []
        for r in data.get("responses", []):
            try:
                ts = datetime.fromisoformat(r["submitted_at"].replace("Z", "+00:00"))
                stars = float(r.get("rating", 0))
                records.append(RawRecord(
                    channel=Channel.WEBSITE,
                    customer_id=r.get("user_id"),
                    timestamp=ts,
                    score=stars,
                ))
            except Exception:
                continue
        return records


class CampaignsConnector(BaseHTTPConnector):
    """Campaigns/NPS connector (Mailchimp, HubSpot, custom)."""

    def __init__(self, api_key: Optional[str] = None, campaign_id: Optional[str] = None, **kwargs):
        super().__init__(**kwargs)
        self.api_key = api_key or os.getenv("CAMPAIGNS_API_KEY")
        self.campaign_id = campaign_id or os.getenv("CAMPAIGNS_ID")

    async def fetch(self, since: datetime, until: datetime) -> list[RawRecord]:
        client = await self._get_client()
        since_iso = since.isoformat()
        until_iso = until.isoformat()

        resp = await client.get(
            f"/campaigns/{self.campaign_id}/nps",
            params={"since": since_iso, "until": until_iso},
        )
        resp.raise_for_status()
        data = resp.json()

        records = []
        for r in data.get("responses", []):
            try:
                ts = datetime.fromisoformat(r["created_at"].replace("Z", "+00:00"))
                nps = float(r.get("score", 0))
                records.append(RawRecord(
                    channel=Channel.CAMPAIGNS,
                    customer_id=r.get("contact_id"),
                    timestamp=ts,
                    score=nps,
                ))
            except Exception:
                continue
        return records


class MobileAppConnector(BaseHTTPConnector):
    """Mobile app rating connector (App Store Connect, Google Play, custom)."""

    def __init__(self, api_key: Optional[str] = None, app_id: Optional[str] = None, **kwargs):
        super().__init__(**kwargs)
        self.api_key = api_key or os.getenv("MOBILE_APP_API_KEY")
        self.app_id = app_id or os.getenv("MOBILE_APP_ID")

    async def fetch(self, since: datetime, until: datetime) -> list[RawRecord]:
        client = await self._get_client()
        since_iso = since.isoformat()
        until_iso = until.isoformat()

        resp = await client.get(
            f"/apps/{self.app_id}/ratings",
            params={"since": since_iso, "until": until_iso},
        )
        resp.raise_for_status()
        data = resp.json()

        records = []
        for r in data.get("ratings", []):
            try:
                ts = datetime.fromisoformat(r["date"].replace("Z", "+00:00"))
                stars = float(r.get("stars", 0))
                records.append(RawRecord(
                    channel=Channel.MOBILE_APP,
                    customer_id=r.get("user_id"),
                    timestamp=ts,
                    score=stars,
                ))
            except Exception:
                continue
        return records


class BlogsOfflineConnector(BaseHTTPConnector):
    """Blogs/Offline thumbs up/down connector."""

    def __init__(self, api_key: Optional[str] = None, source_id: Optional[str] = None, **kwargs):
        super().__init__(**kwargs)
        self.api_key = api_key or os.getenv("BLOGS_OFFLINE_API_KEY")
        self.source_id = source_id or os.getenv("BLOGS_OFFLINE_SOURCE_ID")

    async def fetch(self, since: datetime, until: datetime) -> list[RawRecord]:
        client = await self._get_client()
        since_iso = since.isoformat()
        until_iso = until.isoformat()

        resp = await client.get(
            f"/sources/{self.source_id}/feedback",
            params={"since": since_iso, "until": until_iso},
        )
        resp.raise_for_status()
        data = resp.json()

        records = []
        for r in data.get("feedback", []):
            try:
                ts = datetime.fromisoformat(r["timestamp"].replace("Z", "+00:00"))
                thumb = 1.0 if r.get("thumbs_up") else 0.0
                records.append(RawRecord(
                    channel=Channel.BLOGS_OFFLINE,
                    customer_id=r.get("customer_id"),
                    timestamp=ts,
                    score=thumb,
                ))
            except Exception:
                continue
        return records


class MockConnector(Connector):
    """Mock connector for testing without real APIs."""

    def __init__(self, channel: Channel, records: list[RawRecord]):
        self.channel = channel
        self.records = records

    async def fetch(self, since: datetime, until: datetime) -> list[RawRecord]:
        return [
            r for r in self.records
            if r.timestamp and since <= r.timestamp <= until
        ]


def create_mock_connectors() -> dict[Channel, MockConnector]:
    """Create mock connectors with sample data for testing."""
    from .simulation import build_simulated_agents
    from .models import Channel, RawRecord, DEFAULT_SCALES
    import random
    from datetime import datetime, timedelta, timezone

    now = datetime.now(timezone.utc)
    week_ago = now - timedelta(days=7)

    agents = build_simulated_agents()
    all_records: dict[Channel, list[RawRecord]] = {}

    for agent in agents:
        records = []
        for _ in range(50):
            scale = DEFAULT_SCALES[agent.channel]
            if agent.channel == Channel.INSTAGRAM:
                text = random.choice([
                    "love this, great service",
                    "terrible, worst experience",
                    "okay but slow",
                    "amazing support, so helpful",
                ])
                records.append(RawRecord(
                    channel=agent.channel,
                    customer_id=f"cust-{random.randint(1, 100):04d}",
                    timestamp=now - timedelta(hours=random.randint(1, 168)),
                    text=text,
                ))
            else:
                width = scale.hi - scale.lo
                score = round(scale.lo + random.random() * width)
                records.append(RawRecord(
                    channel=agent.channel,
                    customer_id=f"cust-{random.randint(1, 100):04d}",
                    timestamp=now - timedelta(hours=random.randint(1, 168)),
                    score=score,
                ))
        all_records[agent.channel] = records

    return {ch: MockConnector(ch, recs) for ch, recs in all_records.items()}
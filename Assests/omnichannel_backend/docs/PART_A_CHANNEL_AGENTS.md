# Part A: Channel Agents - Hackathon Backend Implementation Guide

## Overview

Part A implements **channel agents** that scan five customer interaction channels, gather real-time data, and normalize satisfaction signals into a common 0..1 schema. This is the data collection layer of the omnichannel satisfaction backend.

---

## The Five Channels

| Code | Channel | Native Signal | Scale | Normalization |
|------|---------|---------------|-------|---------------|
| **A** | Instagram | Sentiment of comments/DMs | -1.0 to 1.0 | Linear map to 0..1 |
| **B** | Website | 1-5 star survey | 1.0 to 5.0 | Linear map to 0..1 |
| **C** | Campaigns | 0-10 NPS-style | 0.0 to 10.0 | Linear map to 0..1 |
| **D** | Mobile App | 1-5 in-app rating | 1.0 to 5.0 | Linear map to 0..1 |
| **E** | Blogs/Offline | Thumbs up/down | 0 or 1 | Direct (0→0, 1→1) |

**Key Principle**: Out-of-range values become `None` (not clamped) → shows up as incompleteness in evaluation.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     scan_all()                               │
│                  (asyncio.gather)                            │
└─────────────────┬─────────────────┬─────────────────────────┘
                  │                 │
        ┌─────────▼─────┐   ┌───────▼────────┐
        │ ChannelAgent  │   │ ChannelAgent   │  ... (5 total)
        │  (Instagram)  │   │  (Website)     │
        └───────┬───────┘   └───────┬────────┘
                │                   │
        ┌───────▼───────┐   ┌───────▼───────┐
        │  Connector    │   │  Connector    │
        │ fetch(since,  │   │ fetch(since,  │
        │     until)    │   │     until)    │
        └───────┬───────┘   └───────┬───────┘
                │                   │
        ┌───────▼───────────────────▼───────┐
        │         Normalize                 │
        │  score → ScaleSpec.normalize()    │
        │  text → SentimentScorer.score()   │
        └───────────────┬───────────────────┘
                        │
                ┌───────▼───────┐
                │ChannelSnapshot│
                │ - channel     │
                │ - interactions│
                │ - ok: bool    │
                │ - error: str  │
                └───────────────┘
```

---

## Core Components

### 1. `ChannelAgent` (`omnichannel/agents.py:37`)

```python
class ChannelAgent:
    def __init__(self, channel: Channel, connector: Connector, *,
                 scale: Optional[ScaleSpec] = None,
                 scorer: Optional[SentimentScorer] = None,
                 timeout_s: float = 10.0, retries: int = 2, backoff_s: float = 0.2)
```

**Responsibilities:**
- Calls `connector.fetch(since, until)` with timeout
- Retries with exponential backoff (default: 2 retries, 0.2s base)
- Normalizes each record to `Interaction` (0..1 satisfaction, customer_id, timestamp)
- **Never raises** - returns `ChannelSnapshot(ok=False, error=...)` on failure

### 2. `Connector` Protocol (`omnichannel/agents.py:21`)

```python
class Connector(Protocol):
    async def fetch(self, since: datetime, until: datetime) -> list[RawRecord]: ...
```

**Implement one per real integration:**
- Instagram Graph API → comments/DMs
- Website analytics → survey responses
- Campaign platform → NPS responses
- Mobile app backend → in-app ratings
- Blog/offline system → thumbs up/down

### 3. `normalize_record()` (`omnichannel/agents.py:26`)

```python
def normalize_record(raw: RawRecord, scale: ScaleSpec, scorer: SentimentScorer) -> Interaction:
    # Numeric score: scale.normalize(raw.score)
    # Text only: scorer.score(text) → [-1,1] → ScaleSpec(-1,1).normalize()
```

### 4. `SentimentScorer` (`omnichannel/sentiment.py`)

Default: `LexiconScorer` (tiny word list, returns `None` when unknown)

**For production**: Implement LLM-backed scorer:
```python
class LLMSentimentScorer(SentimentScorer):
    async def score(self, text: str) -> Optional[float]:
        # Call LLM API, return -1.0 to 1.0 or None
```

---

## Data Models

### `RawRecord` (channel-native format)
```python
@dataclass
class RawRecord:
    channel: Channel
    customer_id: Optional[str]
    timestamp: Optional[datetime]
    score: Optional[float] = None      # for numeric channels
    text: Optional[str] = None         # for Instagram
    meta: dict[str, Any] = {}
```

### `Interaction` (normalized, common schema)
```python
@dataclass
class Interaction:
    channel: Channel
    customer_id: Optional[str]
    timestamp: Optional[datetime]
    satisfaction: Optional[float]  # 0..1 or None
    
    @property
    def is_complete(self) -> bool:
        return (self.satisfaction is not None
                and self.customer_id is not None
                and self.timestamp is not None)
```

### `ChannelSnapshot` (agent output)
```python
@dataclass
class ChannelSnapshot:
    channel: Channel
    interactions: list[Interaction]
    scanned_at: datetime
    ok: bool
    error: Optional[str] = None
    duration_s: float = 0.0
    attempts: int = 1
```

---

## Running Part A

### Demo (simulated data)
```bash
cd Assests/omnichannel_backend
pip install -r requirements.txt
python -m omnichannel
# Output: sample_output/report.json + report_bar.svg
```

### Unit Tests
```bash
python -m pytest tests/test_core.py -v -k "agent or normalize or sentiment"
```

### API Server (includes Part A → B → C)
```bash
uvicorn omnichannel.api:app --reload
# GET http://localhost:8000/api/v1/report?days=14
```

---

## Plugging in Real Connectors (Your Hackathon Task)

### Step 1: Create Connector Classes

```python
# real_connectors.py
from omnichannel.agents import Connector
from omnichannel.models import Channel, RawRecord
from datetime import datetime

class InstagramConnector(Connector):
    async def fetch(self, since: datetime, until: datetime) -> list[RawRecord]:
        # 1. Call Instagram Graph API
        # 2. Filter by since/until
        # 3. Map to RawRecord(channel=Channel.INSTAGRAM, text=comment_text, ...)
        pass

class WebsiteSurveyConnector(Connector):
    async def fetch(self, since: datetime, until: datetime) -> list[RawRecord]:
        # Call your survey API
        # Map to RawRecord(channel=Channel.WEBSITE, score=stars, ...)
        pass

# ... repeat for CAMPAIGNS, MOBILE_APP, BLOGS_OFFLINE
```

### Step 2: Wire Into the App

```python
# main.py
from omnichannel.agents import ChannelAgent
from omnichannel.api import create_app
from omnichannel.models import Channel
from real_connectors import (
    InstagramConnector, WebsiteSurveyConnector,
    CampaignsConnector, MobileAppConnector, BlogsOfflineConnector
)
from omnichannel.sentiment import LLMSentimentScorer  # your LLM scorer

agents = [
    ChannelAgent(Channel.INSTAGRAM, InstagramConnector(), 
                 scorer=LLMSentimentScorer()),
    ChannelAgent(Channel.WEBSITE, WebsiteSurveyConnector()),
    ChannelAgent(Channel.CAMPAIGNS, CampaignsConnector()),
    ChannelAgent(Channel.MOBILE_APP, MobileAppConnector()),
    ChannelAgent(Channel.BLOGS_OFFLINE, BlogsOfflineConnector()),
]

app = create_app(lambda: agents)
```

### Step 3: Configure CORS & Run

```bash
export OMNI_CORS_ORIGINS="https://your-frontend.vercel.app"
uvicorn main:app --host 0.0.0.0 --port 8000
```

---

## Key Implementation Details

### Timezone Handling
- **All timestamps must be timezone-aware (UTC)**
- Connectors must return `datetime` with `tzinfo=timezone.utc`

### Error Isolation
- One failing channel → `ok=False` snapshot, other channels still processed
- Errors captured in `ChannelSnapshot.error`

### Concurrency
- `scan_all()` runs all 5 agents in parallel via `asyncio.gather`
- Duplicate channel check prevents double-scanning

### Retry Logic
```
Attempt 0: immediate
Attempt 1: wait 0.2s (backoff_s * 2^0)
Attempt 2: wait 0.4s (backoff_s * 2^1)
...
```

---

## Evaluation Criteria (for Part A)

From `docs/EVALUATION.md`:

| Check | Target |
|-------|--------|
| Scale normalization | Stars, NPS, thumbs, sentiment → 0..1 correctly |
| Sentiment scoring | Unknown text returns `None` (not 0.5) |
| Agent retries | Exponential backoff works |
| Failure isolation | One dead channel doesn't stop others |
| Concurrent scan | All 5 agents run in parallel |

---

## Next Steps for Hackathon

1. **Choose 1-2 channels to implement first** (e.g., Website + Instagram)
2. **Build real Connectors** for those channels
3. **Add LLM sentiment scorer** for Instagram text
4. **Test end-to-end** with `python -m omnichannel` using real data
5. **Expose via API** and verify JSON payload matches `LOGIC.md` schema

---

## Files to Reference

| File | Purpose |
|------|---------|
| `omnichannel/agents.py` | ChannelAgent, Connector, normalize_record, scan_all |
| `omnichannel/models.py` | Channel, ScaleSpec, RawRecord, Interaction, ChannelSnapshot |
| `omnichannel/sentiment.py` | SentimentScorer, LexiconScorer |
| `omnichannel/simulation.py` | SimulatedConnector, build_simulated_agents (for testing) |
| `docs/LOGIC.md` | Full specification (sections 1-3, 7) |
| `docs/EVALUATION.md` | Limitations, test results |

---

## Quick Test Checklist

- [ ] Connectors return `RawRecord` with UTC timestamps
- [ ] Numeric channels: score in native scale (1-5, 0-10, etc.)
- [ ] Instagram: `text` field populated, `score=None`
- [ ] LLM scorer returns `float` in `[-1, 1]` or `None`
- [ ] `scan_all()` returns 5 snapshots in < 10s
- [ ] Failed connector → snapshot with `ok=False`, not exception
- [ ] API `/api/v1/report` returns valid JSON with all 5 channels
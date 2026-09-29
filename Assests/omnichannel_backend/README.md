# Omnichannel Customer Satisfaction Dashboard

> Scan five customer channels (Instagram, Website, Campaigns, Mobile App, Blogs/Offline), evaluate satisfaction with statistical rigor, and serve a chart-ready dashboard to your team — all from one server.

**Live URL:** `http://127.0.0.1:8000` · **API docs:** `http://127.0.0.1:8000/docs`

---

## What It Does

Company X reaches customers through five different channels. Each channel produces data in a different format (stars, NPS, thumbs, sentiment text) and reports a different satisfaction rate. This system solves three problems:

| Problem | Solution |
|---------|----------|
| **Inconsistent data formats** | Part A normalizes every channel to a 0–1 satisfaction score |
| **Unreliable raw averages** | Part B applies Bayesian shrinkage, significance tests, and quality gates |
| **No shared visibility** | Part C serves a chart-ready JSON API and React dashboard |

### Pipeline

```
Part A                Part B                    Part C
Channel Agents   →    Evaluation System    →    Frontend API + Dashboard
─────────────────     ────────────────────      ────────────────────────
5 connectors          Reliability gate          GET /api/v1/report
LLM sentiment         Freshness gate            GET /api/v1/ranking
Scale normalisation   Completeness gate         GET /api/v1/summary
Concurrent scan       Bayesian shrinkage        GET /api/v1/chart/*
Retry + isolation     Significance test         React dashboard
                      Like-for-like effect      3 chart types
```

---

## Quick Start

```bash
# 1. Install dependencies
pip install -r requirements.txt
cd frontend && npm install && npm run build && cd ..

# 2. Run tests (17 tests)
python -m pytest -q

# 3. Start the server (backend + frontend in one)
python -m uvicorn omnichannel.api:app --host 0.0.0.0 --port 8000

# 4. Open the dashboard
# → http://127.0.0.1:8000
```

### Dev Mode (hot reload)

```bash
# Terminal 1 — backend
python -m uvicorn omnichannel.api:app --reload --port 8000

# Terminal 2 — frontend (proxies /api to :8000)
cd frontend && npm run dev
# → http://localhost:3000
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Server health + version |
| `GET` | `/api/v1/channels` | List all 5 channels (A–E) |
| `GET` | `/api/v1/report?days=14&bucket_days=1` | Full report: summary + channels + 3 charts |
| `GET` | `/api/v1/ranking?days=14` | Channel rankings with quality metrics |
| `GET` | `/api/v1/summary?days=14` | Lightweight summary for dashboards |
| `GET` | `/api/v1/chart/{id}?days=14` | Individual chart (`satisfaction_by_channel`, `data_quality_breakdown`, `satisfaction_trend`) |
| `GET` | `/api/v1/chart-types` | Chart metadata for frontend discovery |

### Example Response (`/api/v1/report`)

```json
{
  "schema_version": "1.0",
  "summary": {
    "best_channel": {"key": "mobile_app", "code": "D", "label": "Mobile App"},
    "significant_lead": false,
    "channel_gap_points": 12.7,
    "pooled_satisfaction_pct": 68.8,
    "notes": ["channel gap exceeds 10: experience is inconsistent"]
  },
  "channels": [
    {
      "code": "D", "label": "Mobile App",
      "eligible": true, "rank": 1,
      "raw_satisfaction_pct": 74.0,
      "adjusted_satisfaction_pct": 73.7,
      "ci_low_pct": 71.6, "ci_high_pct": 75.7,
      "trend_direction": "declining",
      "data_quality": {"reliability_pct": 100, "freshness_pct": 99.1, ...}
    }
  ],
  "charts": [
    {"id": "satisfaction_by_channel", "type": "bar", ...},
    {"id": "data_quality_breakdown", "type": "grouped_bar", ...},
    {"id": "satisfaction_trend", "type": "line", ...}
  ]
}
```

---

## Dashboard

The React dashboard (served from `/`) has three tabs:

| Tab | What It Shows |
|-----|---------------|
| **Overview** | 5 channel cards with satisfaction, confidence interval, trend, quality, sample size |
| **Rankings** | Sortable table: rank, raw %, adjusted %, 95% CI, power, eligibility |
| **Charts** | Bar chart (satisfaction + error bars), grouped bar (quality breakdown), line chart (trend over time) |

**Controls:** time range (7/14/30/60/90 days), granularity (daily/weekly/bi-weekly/monthly), refresh button, backend health indicator.

---

## Evaluation Logic (Part B)

### Stage 1 — Quality Gates

| Check | Formula | Gate |
|-------|---------|------|
| Reliability | `min(1, k / 30)` | ≥ 30 scored responses |
| Freshness | `clip(1 - age / 24h)` | ≥ 50% |
| Completeness | complete records / total | ≥ 80% |

Failed channels stay in the report with reasons — they are simply not ranked.

### Stage 2 — Ranking

- **Bayesian shrinkage:** `(k × raw + 20 × pooled) / (k + 20)` — small samples pull toward the pooled mean
- **95% CI:** `adjusted ± 1.96 × se`
- **Significance:** lead counts only if `top − second > 1.96 × √(se₁² + se₂²)`
- **Gap alert:** flags when best − worst exceeds 10 points (inconsistent experience)

---

## Real Data Connectors (Part A)

Simulated data works out of the box. For real channels:

### 1. Start Ollama (Instagram sentiment)

```bash
ollama serve
ollama pull llama3.2:3b
```

### 2. Set environment variables

```bash
export INSTAGRAM_ACCESS_TOKEN=...
export INSTAGRAM_BUSINESS_ACCOUNT_ID=...
export WEBSITE_SURVEY_API_KEY=...
export WEBSITE_SURVEY_ID=...
export CAMPAIGNS_API_KEY=...
export CAMPAIGNS_ID=...
export MOBILE_APP_API_KEY=...
export MOBILE_APP_ID=...
export BLOGS_OFFLINE_API_KEY=...
export BLOGS_OFFLINE_SOURCE_ID=...
export OLLAMA_BASE_URL=http://localhost:11434   # optional
export OLLAMA_MODEL=llama3.2:3b                  # optional
```

### 3. Run with real data

```bash
python -m omnichannel.main_real --days 14          # CLI
python -m omnichannel.main_real --mock --days 14   # mock test
```

### Custom Connector

```python
from omnichannel.agents import ChannelAgent
from omnichannel.models import Channel, RawRecord

class MyConnector:
    async def fetch(self, since, until):
        rows = await my_api.list(since, until)
        return [RawRecord(Channel.WEBSITE, r.user_id, r.created_at, score=r.stars)
                for r in rows]

app = create_app(lambda: [ChannelAgent(Channel.WEBSITE, MyConnector()), ...])
```

---

## Project Structure

```
omnichannel_backend/
├── omnichannel/
│   ├── agents.py            # Part A: ChannelAgent, scan_all, Connector protocol
│   ├── connectors.py        # 5 real connectors + MockConnector
│   ├── sentiment.py         # LexiconScorer, OllamaSentimentScorer, HybridSentimentScorer
│   ├── llm_client.py        # Async Ollama client
│   ├── models.py            # Channel, RawRecord, Interaction, ChannelSnapshot, ScaleSpec
│   ├── evaluator.py         # Part B: quality gates + Bayesian ranking + trend/power
│   ├── pipeline.py          # Orchestrates A → B → C
│   ├── presenter.py         # Part C: builds chart-ready JSON payload
│   ├── api.py               # FastAPI + static frontend serving
│   ├── svg.py               # Server-side SVG chart rendering
│   ├── simulation.py        # Simulated connectors with ground truth
│   ├── main_real.py         # Real-data entry point
│   └── __main__.py          # Simulated demo entry point
├── frontend/
│   ├── src/
│   │   ├── pages/Dashboard.tsx          # Main dashboard (3 tabs)
│   │   ├── components/ui/               # ChannelCard, RankingTable, SummaryCards
│   │   ├── components/charts/           # Chart.js bar/grouped/line renderers
│   │   ├── hooks/useApi.ts              # React Query hooks
│   │   ├── lib/api.ts                   # Axios API client
│   │   ├── lib/utils.ts                 # Formatters, colors, badges
│   │   └── types/api.ts                 # TypeScript interfaces for all endpoints
│   ├── dist/                            # Production build (served by backend)
│   └── vite.config.ts                   # Dev proxy to :8000
├── docs/
│   ├── LOGIC.md                         # Full specification
│   ├── PART_A_CHANNEL_AGENTS.md         # Part A implementation guide
│   ├── EVALUATION.md                    # Evaluation methodology + limitations
│   └── diagrams/                        # 4 SVG architecture diagrams
├── tests/
│   ├── test_core.py                     # 14 core tests
│   └── test_api.py                      # 3 API tests
├── scripts/
│   ├── evaluate.py                      # Monte-Carlo evaluation (300 seeds)
│   └── make_diagrams.py                 # Regenerate SVG diagrams
├── requirements.txt
└── README.md
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python 3.14, FastAPI, uvicorn, httpx |
| Frontend | React 19, TypeScript, Vite 8, Tailwind CSS 4 |
| Charts | Chart.js 4 + react-chartjs-2 |
| State | TanStack React Query 5 |
| LLM | Ollama (local) + hybrid fallback |
| Tests | pytest (17 tests) |

---

## Testing

```bash
python -m pytest -q                          # 17 tests pass
python -m omnichannel                        # CLI demo (simulated)
python -m omnichannel.main_real --mock        # Real-connector pipeline (mock)
python scripts/evaluate.py --seeds 300        # Monte-Carlo evaluation
cd frontend && npm run build                  # TypeScript check + production build
```

### Test Coverage

- Scale normalisation (stars, NPS, thumbs, sentiment → 0..1)
- Sentiment scoring (lexicon + Ollama hybrid)
- Agent retries, timeout, failure isolation
- Duplicate channel rejection
- Small-sample gate, stale/incomplete data gates
- Significance vs near-tie detection
- Like-for-like effect recovery
- API parameter validation (422 on bad input)
- Full payload shape + JSON safety
- Pipeline survives channel outage

---

## Evaluation Results

From `scripts/evaluate.py` (300 seeds, 14-day window):

| Scenario | Naive picks true best | Our evaluator picks true best |
|----------|----------------------:|-----------------------------:|
| Small channel is truly worse | 78.7% | **98.3%** |
| Small channel is truly average | 68.0% | **98.3%** |
| Small channel is truly best | 86.0% | 0.0% (by design — needs more data) |

**Key finding:** the naive logic is fooled by luck in a 12-response channel 20–31% of runs. Ours never selects it, and the report flags the exclusion with the reason.

---

## Documentation

| Document | Description |
|----------|-------------|
| [`docs/LOGIC.md`](docs/LOGIC.md) | Full specification: problem, 3-part design, API contract |
| [`docs/PART_A_CHANNEL_AGENTS.md`](docs/PART_A_CHANNEL_AGENTS.md) | Part A implementation guide |
| [`docs/EVALUATION.md`](docs/EVALUATION.md) | Evaluation methodology, measured results, 9 limitations |
| [`docs/diagrams/`](docs/diagrams/) | 4 SVG diagrams: channels, pipeline, evaluator flow, satisfaction chart |

---

## License

MIT

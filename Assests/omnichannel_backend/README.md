# Omnichannel Satisfaction Backend

Core backend for the "omnichannel consistency" proposal: agents scan five channels (A Instagram, B Website, C Campaigns, D Mobile App, E Blogs/Offline), an evaluator compares the data, and a chart-ready payload is served to the frontend.

## Documentation

- Logic and API contract: `docs/LOGIC.md`
- **Part A implementation guide: `docs/PART_A_CHANNEL_AGENTS.md`**
- Evaluation and limitations: `docs/EVALUATION.md`
- Diagrams: `docs/diagrams/*.svg`

## Quick Start (Simulated Data)

```bash
pip install -r requirements.txt
python -m omnichannel                  # demo run on simulated data
uvicorn omnichannel.api:app --reload   # API on http://localhost:8000/api/v1/report
python -m pytest -q
```

## Part A: Real Channel Connectors

For real data, use the new entry point with mock or real connectors:

```bash
# Test with mock connectors (no API keys needed)
python -m omnichannel.main_real --mock --days 14

# Run API server with mock connectors
uvicorn omnichannel.main_real:app --reload --port 8000
```

### Real Data Setup

1. **Start Ollama** (for Instagram sentiment):
   ```bash
   ollama serve
   ollama pull llama3.2:3b
   ```

2. **Set environment variables** for each channel connector:
   ```bash
   # Instagram
   export INSTAGRAM_ACCESS_TOKEN=...
   export INSTAGRAM_BUSINESS_ACCOUNT_ID=...

   # Website Survey
   export WEBSITE_SURVEY_API_KEY=...
   export WEBSITE_SURVEY_ID=...

   # Campaigns
   export CAMPAIGNS_API_KEY=...
   export CAMPAIGNS_ID=...

   # Mobile App
   export MOBILE_APP_API_KEY=...
   export MOBILE_APP_ID=...

   # Blogs/Offline
   export BLOGS_OFFLINE_API_KEY=...
   export BLOGS_OFFLINE_SOURCE_ID=...

   # Ollama (optional - defaults to localhost:11434, llama3.2:3b)
   export OLLAMA_BASE_URL=http://localhost:11434
   export OLLAMA_MODEL=llama3.2:3b
   ```

3. **Run with real connectors**:
   ```bash
   python -m omnichannel.main_real --days 14
   # or
   uvicorn omnichannel.main_real:app --reload --port 8000
   ```

## Architecture (Part A → B → C)

| Part | Module | Description |
|------|--------|-------------|
| **A** | `agents.py`, `connectors.py`, `sentiment.py`, `llm_client.py` | Channel agents scan 5 channels, normalize to 0..1 satisfaction |
| **B** | `evaluator.py` | Data quality checks + statistical ranking with shrinkage |
| **C** | `presenter.py`, `api.py`, `svg.py` | Chart-ready JSON + server-side SVG rendering |

## Project Structure

```
omnichannel_backend/
├── omnichannel/
│   ├── agents.py          # ChannelAgent, scan_all, Connector protocol
│   ├── connectors.py      # Real connectors (Instagram, Website, etc.) + MockConnector
│   ├── sentiment.py       # LexiconScorer, OllamaSentimentScorer, HybridSentimentScorer
│   ├── llm_client.py      # Async Ollama client
│   ├── models.py          # Channel, RawRecord, Interaction, ChannelSnapshot, ScaleSpec
│   ├── evaluator.py       # Part B: data quality gates + adjusted satisfaction ranking
│   ├── pipeline.py        # Orchestrates A → B → C
│   ├── presenter.py       # Part C: builds API payload
│   ├── api.py             # FastAPI endpoints
│   ├── svg.py             # Server-side chart rendering
│   ├── simulation.py      # Simulated connectors with ground truth
│   ├── main_real.py       # Real-data entry point (NEW)
│   └── __main__.py        # Simulated demo entry point
├── docs/
│   ├── LOGIC.md
│   ├── PART_A_CHANNEL_AGENTS.md
│   ├── EVALUATION.md
│   └── diagrams/
├── tests/
│   ├── test_core.py       # 13 core tests
│   └── test_api.py        # 3 API tests
├── scripts/
│   ├── evaluate.py        # Monte-Carlo evaluation
│   └── make_diagrams.py   # Regenerate SVG diagrams
├── requirements.txt
├── .gitignore
└── README.md
```

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /health` | Health check |
| `GET /api/v1/channels` | List all 5 channels |
| `GET /api/v1/report?days=14&bucket_days=1` | Full satisfaction report (schema v1.0) |

## Testing

```bash
python -m pytest tests/ -v     # All 16 tests pass
python scripts/evaluate.py --seeds 300  # Monte-Carlo evaluation
```
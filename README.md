# Omnichannel Satisfaction Dashboard

A full-stack analytics project that evaluates customer satisfaction across five channels: Instagram, Website, Campaigns, Mobile App, and Blogs/Offline. The backend aggregates channel data, applies statistical quality checks and ranking logic, and exposes a chart-ready API. The frontend renders a live dashboard to visualize the results.

## Project Overview

This project combines:
- Python backend with FastAPI
- Statistical evaluation and ranking layer
- Real or simulated channel connectors
- Local Ollama sentiment analysis support
- React + TypeScript + Vite frontend dashboard

## Tech Stack

- Backend: Python, FastAPI, Uvicorn
- Frontend: React, TypeScript, Vite, Tailwind CSS
- Analytics: custom evaluators, quality gates, and ranking logic
- AI: Ollama integration for sentiment scoring

## Repository Structure

```text
Hackathon Project/
├── README.md
├── Assests/
│   └── omnichannel_backend/
│       ├── omnichannel/
│       ├── docs/
│       ├── frontend/
│       ├── tests/
│       ├── scripts/
│       ├── requirements.txt
│       └── README.md
└── .git/
```

## Backend Setup

```bash
cd /home/shiv0x/Projects/Hackathon\ Project/Assests/omnichannel_backend
python3 -m pip install -r requirements.txt
PYTHONPATH=. python3 -m uvicorn omnichannel.api:app --host 0.0.0.0 --port 8000
```

Check the API:

```bash
curl http://127.0.0.1:8000/health
curl "http://127.0.0.1:8000/api/v1/report?days=7&bucket_days=1"
```

## Frontend Setup

```bash
cd /home/shiv0x/Projects/Hackathon\ Project/Assests/omnichannel_backend/frontend
npm install
npm run dev -- --host 0.0.0.0 --port 3000
```

Open the app at:

- http://localhost:3000

## Production Build

```bash
cd /home/shiv0x/Projects/Hackathon\ Project/Assests/omnichannel_backend/frontend
npm run build
```

## Verified Status

This project has been validated with:
- Python backend tests: passing
- Frontend production build: passing
- Live health and API checks: successful

## API Endpoints

- GET /health
- GET /api/v1/channels
- GET /api/v1/report
- GET /api/v1/summary
- GET /api/v1/ranking
- GET /api/v1/chart-types
- GET /api/v1/chart/{chart_id}

## Notes

This repository is prepared for local development and deployment testing. The backend and frontend are connected through the configured API base and Vite proxy settings.

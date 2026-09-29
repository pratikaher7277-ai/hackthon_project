# Evaluation

Two things are evaluated: (1) the original logic from the handwritten proposal, and (2) the implementation.

All measured numbers come from simulated data with known ground truth (`scripts/evaluate.py`, 300 random seeds per scenario, 14-day window). They show how the logic behaves; they do not show accuracy on real customers.

## 1. The original logic, assessed

| Aspect | Assessment |
|---|---|
| Structure (scan, compare, deliver) | Sound. Separating collection, evaluation and presentation makes each part testable and replaceable. |
| One agent per channel, in parallel | Sound, and resilient if failures are isolated (implemented). |
| "Best data = higher satisfaction" | Weak as stated. It mixes up *data quality* with *channel performance*, and a raw average is unreliable for small samples. |
| Different scales per channel | Not addressed in the note. Stars, NPS, thumbs and sentiment cannot be averaged as-is. Normalisation is required. |
| Different audiences per channel | Not addressed. A channel can look better only because happier customers use it. |
| Connection to the original problem | Partial. The problem is *inconsistency*; picking a winner does not reduce it. The implementation adds a channel-gap measure and flags. |
| "Data ... shared between customers" | Ambiguous. Interpreted here as interaction data exchanged between the company and customers. Confirm the intent. |
| "Frontend ... with a higher rate of customer satisfaction" | Displaying satisfaction does not raise it. The backend supports decisions; improving satisfaction needs actions on the weak channels. |

## 2. What the fixes buy, measured

Setup: five channels; four large ones (140-310 responses each) plus channel E with only 12 responses and noisy ratings. The "original logic" is highest raw average wins.

| Scenario | Original logic picks true best | Proposed evaluator picks true best | Original logic picks tiny channel E |
|---|---:|---:|---:|
| S1: E is truly worse | 78.7% | 98.3% | 20.3% |
| S3: E is truly average | 68.0% | 98.3% | 31.3% |
| S2: E is truly the best | 86.0% | **0.0%** | 86.0% |

Reading the table:

- **S1 and S3:** the original logic is fooled by luck in the 12-response channel in 20-31% of runs. The proposed evaluator never selects it, and finds the true best channel 98.3% of the time.
- **S2 is a real weakness (see L4).** When the tiny channel really is best, the original logic often finds it and the proposed evaluator never can, because the sample-size gate excludes it. This is a deliberate trade: it avoids false wins but cannot promote a channel with too little data. The report does list the exclusion and the reason, so the channel can be flagged for more data collection.
- **Lead significance:** in 53.7% of runs the top two channels (Mobile App and Website, true gap 3 points) were a statistical near-tie, and the report says so. Presenting a single "winner" without that flag would overstate certainty about half the time.

## 3. Implementation checks

- 16 automated tests pass (`python -m pytest -q`). They cover scale normalisation, sentiment scoring, agent retries and failure isolation, duplicate-channel rejection, the small-sample gate, stale and incomplete data gates, failed channels, near-tie versus clear-win significance, the no-eligible-channel case, weight validation, recovery of a known like-for-like effect (+5 / -5 points), payload shape and JSON safety, outage handling, and the API endpoints including parameter validation.
- Simulated end-to-end run: all five agents complete, the payload contains three charts and five channel rows, and the outage scenario returns the failed channel as `failed` while still selecting a best channel from the rest.

## 4. Limitations

| ID | Limitation | Impact / next step |
|---|---|---|
| L1 | Only simulated connectors are included. No real Instagram, web, app or campaign integrations. | Results above are about the logic, not real-world accuracy. Build connectors next. |
| L2 | Linear mapping of stars, NPS, thumbs and sentiment to 0..1 assumes the scales are comparable. | Could bias comparisons. Calibrate using customers seen on several channels. |
| L3 | Customers are matched across channels by a shared `customer_id`. Real channels rarely share one (handle vs account vs offline). | The like-for-like effect needs identity resolution to be meaningful on real data. |
| L4 | Channels below the sample-size gate can never win (S2 above). | Add a "promising, needs more data" flag for gated channels with high raw scores. |
| L5 | The default sentiment scorer is a tiny word list. | Replace with a model or LLM scorer and measure it against labelled comments. |
| L6 | Thresholds (30 samples, 24 h staleness, shrinkage strength 20, 10-point gap alert) are untuned defaults. | Tune on real data; they are all in `EvalConfig`. |
| L7 | Freshness uses only the newest record. | A channel with one recent record and stale history looks fresh. Consider a coverage-over-time check. |
| L8 | No persistence, caching, authentication or rate limiting. The report is recomputed per request. | Required before production use. |
| L9 | Agents are deterministic workers with optional LLM sentiment; there is no autonomous planning by an LLM. | Matches the design at a basic level. Extend if agent-driven source discovery is wanted. |

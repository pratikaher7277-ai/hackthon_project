"""Generates the SVG diagrams used in docs/. Run: python scripts/make_diagrams.py"""
from pathlib import Path
from xml.sax.saxutils import escape

OUT = Path(__file__).resolve().parent.parent / "docs" / "diagrams"
OUT.mkdir(parents=True, exist_ok=True)
FONT = 'font-family="Helvetica, Arial, sans-serif"'
INK, MUTE, LINE = "#1f2937", "#6b7280", "#475569"
BLUE, GREEN, AMBER, RED, PURPLE = "#dbeafe", "#dcfce7", "#fef3c7", "#fee2e2", "#ede9fe"


def head(w, h, title):
    return [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" {FONT}>',
            f'<title>{escape(title)}</title>',
            '<defs><marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" '
            f'orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="{LINE}"/></marker></defs>',
            f'<rect width="{w}" height="{h}" fill="#ffffff"/>']


def text(x, y, s, size=13, bold=False, anchor="middle", fill=INK):
    return (f'<text x="{x}" y="{y}" font-size="{size}" text-anchor="{anchor}" fill="{fill}"'
            f'{" font-weight=\"bold\"" if bold else ""}>{escape(s)}</text>')


def box(x, y, w, h, lines, fill=BLUE, size=13, bold_first=False):
    out = [f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="{fill}" stroke="{LINE}" stroke-width="1.2"/>']
    n = len(lines)
    y0 = y + h / 2 - (n - 1) * 8 + 4
    for i, ln in enumerate(lines):
        out.append(text(x + w / 2, y0 + i * 16, ln, size, bold=(bold_first and i == 0)))
    return out


def arrow(x1, y1, x2, y2, label=None, lx=None, ly=None):
    out = [f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{LINE}" stroke-width="1.6" marker-end="url(#ar)"/>']
    if label:
        out.append(text(lx if lx is not None else (x1 + x2) / 2, ly if ly is not None else (y1 + y2) / 2 - 6,
                        label, 12, bold=True, fill=LINE))
    return out


def save(name, parts):
    (OUT / name).write_text("\n".join(parts + ["</svg>"]))


# 1. Channels ---------------------------------------------------------------------------
p = head(760, 470, "Company X and its five channels")
p += [text(380, 28, "Modes of interaction between Company X and customers", 16, True)]
p += box(310, 190, 140, 56, ["Company X"], PURPLE, 16, True)
chan = [("A", "Instagram", 40, 70, 190, 96, 315, 205, AMBER),
        ("B", "Website", 40, 330, 190, 356, 315, 232, BLUE),
        ("C", "Campaigns", 310, 385, 380, 385, 380, 246, GREEN),
        ("D", "Mobile App", 580, 330, 580, 356, 445, 232, RED),
        ("E", "Blogs / Offline", 580, 70, 580, 96, 445, 205, BLUE)]
for code, name, x, y, ex, ey, sx, sy, fill in chan:
    w = 140
    p += box(x, y, w, 52, [f"{code}: {name}"], fill, 13, True)
    p += arrow(sx, sy, ex if code in "AB" else (x if code in "DE" else 380), ey if code != "C" else y, None)
mid = {"A": (250, 138), "B": (250, 300), "C": (392, 320), "D": (510, 300), "E": (510, 138)}
for k, (mx, my) in mid.items():
    p.append(f'<circle cx="{mx}" cy="{my}" r="11" fill="#ffffff" stroke="{LINE}"/>')
    p.append(text(mx, my + 4, k, 12, True))
p += [text(380, 455, "Problem: each channel yields data in its own format and its own satisfaction rate.", 13, False, fill=MUTE)]
save("01_channels.svg", p)

# 2. Pipeline ---------------------------------------------------------------------------
p = head(920, 400, "Three-part pipeline")
p += [text(460, 28, "Solution pipeline: Part A, Part B, Part C", 16, True)]
panels = [(20, "Part A: Agentic scan", BLUE), (330, "Part B: Evaluation system", GREEN),
          (640, "Part C: Transfer to frontend", AMBER)]
for x, title, fill in panels:
    p.append(f'<rect x="{x}" y="50" width="260" height="300" rx="12" fill="{fill}" stroke="{LINE}" stroke-width="1.2"/>')
    p.append(text(x + 130, 78, title, 14, True))
for i, (c, n) in enumerate([("A", "Instagram"), ("B", "Website"), ("C", "Campaigns"), ("D", "Mobile App"), ("E", "Blogs / Offline")]):
    p += box(40, 92 + i * 34, 220, 28, [f"Agent {c}: {n}"], "#ffffff", 12)
p += [text(150, 280, "Parallel, retried, failure-isolated", 12, fill=MUTE),
      text(150, 297, "Normalise every scale to 0-1", 12, fill=MUTE),
      text(150, 314, "Output: one snapshot per channel", 12, fill=MUTE)]
labels = [["Checks: reliability, freshness,", "completeness"], ["Gate: pass / fail with reasons"],
          ["Adjust small samples (shrinkage)"], ["Rank eligible by satisfaction"],
          ["Is the lead statistically real?"], ["Like-for-like effect (same customers)"]]
ys = [92, 150, 190, 230, 270, 310]
hs = [46, 30, 30, 30, 30, 30]
for (lab, y, h) in zip(labels, ys, hs):
    p += box(350, y, 220, h, lab, "#ffffff", 12)
p += box(660, 92, 220, 46, ["JSON payload (schema 1.0)"], "#ffffff", 12)
for i, t in enumerate(["Bar: satisfaction + interval", "Grouped bar: data quality", "Line: trend over time"]):
    p += box(660, 150 + i * 40, 220, 32, [t], "#ffffff", 12)
p += box(660, 275, 220, 46, ["Frontend dashboard", "GET /api/v1/report"], PURPLE, 12, True)
p += arrow(282, 200, 328, 200) + arrow(592, 200, 638, 200)
save("02_pipeline.svg", p)

# 3. Evaluation flow --------------------------------------------------------------------
p = head(760, 730, "Evaluator decision flow")
p += [text(380, 26, "Part B: evaluator decision flow", 16, True)]
cx = 380


def diamond(cy, label, fill=AMBER):
    pts = f"{cx},{cy - 32} {cx + 125},{cy} {cx},{cy + 32} {cx - 125},{cy}"
    return [f'<polygon points="{pts}" fill="{fill}" stroke="{LINE}" stroke-width="1.2"/>', text(cx, cy + 4, label, 12, True)]


p += box(cx - 130, 44, 260, 44, ["Channel snapshots from Part A"], BLUE)
p += arrow(cx, 88, cx, 118)
p += diamond(150, "Scan succeeded?")
p += arrow(cx + 125, 150, 560, 150, "no", 540, 142)
p += box(560, 128, 180, 44, ["Mark failed,", "exclude from ranking"], RED, 12)
p += arrow(cx, 182, cx, 222, "yes", cx + 16, 208)
p += box(cx - 130, 222, 260, 52, ["Compute checks:", "reliability, freshness, completeness"], BLUE, 12)
p += arrow(cx, 274, cx, 304)
p += diamond(336, "All three gates pass?")
p += arrow(cx + 125, 336, 560, 336, "no", 540, 328)
p += box(560, 314, 180, 44, ["Ineligible,", "reasons listed"], RED, 12)
p += arrow(cx, 368, cx, 408, "yes", cx + 16, 394)
p += box(cx - 130, 408, 260, 52, ["Shrink satisfaction toward pooled", "mean; compute 95% interval"], GREEN, 12)
p += arrow(cx, 460, cx, 490)
p += box(cx - 130, 490, 260, 44, ["Rank eligible channels by", "adjusted satisfaction"], GREEN, 12)
p += arrow(cx, 534, cx, 564)
p += diamond(596, "Lead beats noise (z > 1.96)?")
p += arrow(cx - 125, 596, 200, 596, "no", 220, 588)
p += box(20, 574, 180, 44, ["Best channel + near-tie", "warning"], AMBER, 12)
p += arrow(cx + 125, 596, 560, 596, "yes", 540, 588)
p += box(560, 574, 180, 44, ["Best channel,", "clear lead"], GREEN, 12)
p += [f'<polyline points="110,618 110,676 {cx - 130},676" fill="none" stroke="{LINE}" stroke-width="1.6" marker-end="url(#ar)"/>',
      f'<polyline points="650,618 650,676 {cx + 130},676" fill="none" stroke="{LINE}" stroke-width="1.6" marker-end="url(#ar)"/>']
p += box(cx - 130, 654, 260, 44, ["Report to Part C", "(chart payload)"], PURPLE, 12, True)
save("03_evaluator_flow.svg", p)
print("written:", sorted(x.name for x in OUT.iterdir()))

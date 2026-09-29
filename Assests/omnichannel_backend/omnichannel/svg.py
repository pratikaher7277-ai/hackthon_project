"""Server-side SVG rendering of the main chart (for reports, emails, docs)."""
from __future__ import annotations

from typing import Any
from xml.sax.saxutils import escape

BEST, OK, OUT = "#0f766e", "#3b82f6", "#9ca3af"


def render_bar_svg(payload: dict[str, Any]) -> str:
    chart = next(c for c in payload["charts"] if c["id"] == "satisfaction_by_channel")
    xs, vals = chart["x"], chart["series"][0]["data"]
    lo, hi = chart["error"]["low"], chart["error"]["high"]
    elig, best = chart["eligible"], chart["highlight"]
    W, H = 760, 430
    L, R, T, B = 60, 20, 60, 90
    pw, ph = W - L - R, H - T - B
    n = len(xs)
    slot = pw / n
    bw = slot * 0.55

    def y(v: float) -> float:
        return T + ph * (1 - v / 100.0)

    p = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" '
         f'font-family="Helvetica, Arial, sans-serif">',
         f'<rect width="{W}" height="{H}" fill="#ffffff"/>',
         f'<text x="{L}" y="28" font-size="16" font-weight="bold" fill="#111827">'
         f'{escape(chart["title"])}</text>',
         f'<text x="{L}" y="46" font-size="11" fill="#6b7280">whiskers = 95% interval; '
         f'grey bars failed a data-quality check</text>']
    for t in range(0, 101, 20):
        p.append(f'<line x1="{L}" y1="{y(t):.1f}" x2="{W - R}" y2="{y(t):.1f}" stroke="#e5e7eb"/>')
        p.append(f'<text x="{L - 8}" y="{y(t) + 4:.1f}" font-size="11" text-anchor="end" '
                 f'fill="#6b7280">{t}%</text>')
    for i, label in enumerate(xs):
        cx = L + slot * (i + 0.5)
        v = vals[i]
        if v is None:
            p.append(f'<text x="{cx:.1f}" y="{y(0) - 8:.1f}" font-size="11" text-anchor="middle" '
                     f'fill="#9ca3af">no data</text>')
        else:
            color = BEST if i == best else (OK if elig[i] else OUT)
            p.append(f'<rect x="{cx - bw / 2:.1f}" y="{y(v):.1f}" width="{bw:.1f}" '
                     f'height="{y(0) - y(v):.1f}" fill="{color}" rx="3"/>')
            if lo[i] is not None and hi[i] is not None:
                p.append(f'<line x1="{cx:.1f}" y1="{y(hi[i]):.1f}" x2="{cx:.1f}" y2="{y(lo[i]):.1f}" '
                         f'stroke="#111827" stroke-width="1.5"/>')
                for e in (hi[i], lo[i]):
                    p.append(f'<line x1="{cx - 6:.1f}" y1="{y(e):.1f}" x2="{cx + 6:.1f}" '
                             f'y2="{y(e):.1f}" stroke="#111827" stroke-width="1.5"/>')
            p.append(f'<text x="{cx:.1f}" y="{y(hi[i] if hi[i] is not None else v) - 6:.1f}" '
                     f'font-size="11" font-weight="bold" text-anchor="middle" fill="#111827">{v:.1f}</text>')
        p.append(f'<text x="{cx:.1f}" y="{y(0) + 18:.1f}" font-size="11" text-anchor="middle" '
                 f'fill="#374151">{escape(label)}</text>')
    lx = L
    for color, text in ((BEST, "Best (passed checks)"), (OK, "Passed checks"), (OUT, "Failed a check")):
        p.append(f'<rect x="{lx}" y="{H - 30}" width="12" height="12" fill="{color}" rx="2"/>')
        p.append(f'<text x="{lx + 18}" y="{H - 20}" font-size="11" fill="#374151">{text}</text>')
        lx += 170
    p.append("</svg>")
    return "\n".join(p)

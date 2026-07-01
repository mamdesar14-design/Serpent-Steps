---
name: Board visual system
description: How the Snake & Ladder board renders cells, snakes, ladders, and tokens
---

## Cell rendering
- HTML `div` CSS grid (10×10), each cell uses inline `style` with `background` gradient + `borderColor`
- `getCellBg(pos, level, isEven)` returns `React.CSSProperties` — do NOT use Tailwind bg-* for cell colors
- Row ordering: row 9→0 from top, even rows left-to-right, odd rows right-to-left (snake-path board numbering)

## SVG overlay layers
- z-10: snakes and ladders SVG
- z-20: player tokens SVG

## getCellCoords(pos, cellSize)
Maps board position (1-100) to SVG center coords. pos=0 returns {x:-1,y:-1} (off-board).

## Cell colors
- Even cells: navy gradient; Odd: darker navy
- Snake cells (L1/L2): dark red | Snake cells (L3): dark purple
- Ladder cells (safe): dark green | Trick: dark orange | Bonus roll: dark blue
- Cell 1: navy blue start | Cell 100: dark gold finish

**Why:** Inline style gives full control over gradients + borderColor. Tailwind class approach limited to preset palette and caused poor contrast on the board.

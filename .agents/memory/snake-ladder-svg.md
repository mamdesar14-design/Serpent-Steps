---
name: Snake/Ladder SVG approach
description: How snakes and ladders are drawn as real SVG artwork on the board
---

## Snake SVG (SnakeSVG + SnakeHead components)
- `buildSnakePath(start, end, dir: 1|-1)` → S-curve cubic bezier: C control points at 28% and 72% along path, offset by `amp = min(46, max(16, len*0.24))` pixels perpendicular
- Renders: shadow path, outer body (stroke 12), inner body (stroke 8), scale dasharray pattern, belly highlight, SnakeHead at `from`, tail dot at `to`
- SnakeHead: ellipse rotated by body angle + eyes (white circle + dark pupil) + forked tongue (f87171 red path)
- Snake head is at `from` (high number), tail at `to` (low number)
- Colors: L1/L2 red (#7f1d1d outer, #ef4444 inner), L3 purple (#4c1d95 outer, #9333ea inner)

## Ladder SVG (LadderSVG component)
- `ladderGeo(start, end, halfWidth=7)` → {lS, lE, rS, rE, rungs[]}
- Perpendicular offset of halfWidth px each side; rungs = floor(len/20) evenly spaced
- Renders: shadow group (translate 1.5,1.5), left+right rails (stroke 5), rail highlights (stroke 1.5, white 25%), rungs (stroke 4 + shadow + highlight), cap circles at start/end
- Colors: #22c55e (safe), #f97316 (trick), #3b82f6 (bonus roll)

**Why:** HTML/CSS cannot draw diagonal paths naturally. SVG cubic bezier gives smooth S-curves for snakes and proper angle control for ladders.

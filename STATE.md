# Screeps Evolution State

## 🎯 Current High-Level Objective
- Fill storage to 20k+ to enable full senator scaling, then push to RCL6

## 📊 Last Known State (UTC: 2026-03-19T15:30:00Z)
- **RCL:** 5 (controller progress: 134,062 / ~150,000 ≈ ~89%)
- **GCL:** 2 (1,489,469 pts)
- **Economy:** RECOVERING — tower 317/1000, extensions 20/30 built (6 filled, 300/1000),
  storage 0, spawn 150/300
- **Threat Level:** None (no hostiles)
- **Pop:** 5 creeps — 5 Legio (1x[WWCMM], 4x[WWCCCMMMM]), 0 Senator, 0 Archi

## 🧠 Strategic Handover
- **Last Session Actions:**
  1. Diagnosed population crash 12→5 legionnaires: spawn deadlock
     - Partial spawn threshold was 550, avail often stuck at 350-549 window
     - With cap=1300, spawn only fired at full cap (slow ~45 tick cycles)
     - **Fixed:** lowered partial spawn threshold 550→350 (main.js)
     - Now spawns [WWCM] body at avail≥350 — fast recovery from any energy level
  2. Found critical architect bug: 26 constructed walls all at 1 hit
     - Old code: urgent repair triggered for walls with hits < 10000
     - Architects would NEVER build — stuck repairing walls forever
     - **Fixed:** removed walls/ramparts from architect repair logic entirely
     - Tower handles wall repair; architects now focus on building extensions
  3. Deployed code, committed and pushed to claude/screeps-improvements-LpFuZ

- **Current Blocker:** None. With avail=450 ≥ 350, spawn fires immediately next tick.

- **Next Logic Gate:**
  1. Pop reaches 8 legionnaires → senator spawning begins
  2. Pop reaches 8L + 2S → architect spawning begins (target: 4 architects)
  3. Architects build 10 extension sites → 30 extensions (cap rises to 1550)
  4. Tower hits 1000 → no more emergency fill
  5. Storage starts accumulating → senators un-idle and upgrade
  6. Storage > 20k → senator cap lifts, scale to 4 senators
  7. Storage > 50k → place second tower construction site
  8. RCL6 → new structure tier unlocks

## 🛠 Active Tasks
- [x] Fix source distribution (findClosestByPath) — prior session
- [x] Fix tower emergency priority in legionnaire — prior session
- [x] Fix senator idle during economy crisis — prior session
- [x] Place 10 extension construction sites (30 total at RCL5 cap) — prior session
- [x] Place road gap tiles near source b526 — prior session
- [x] Fix spawn deadlock: lower partial spawn threshold 550→350
- [x] Fix architect wall repair bug (26 walls at 1 hit blocked all building)
- [ ] Monitor: confirm population recovers to 8 legionnaires
- [ ] Monitor: confirm architects spawn and build extension sites
- [ ] Roads: fill remaining gaps in south route to source b527
- [ ] When storage > 50k: place second tower site
- [ ] When RCL6: evaluate new structure placement

## 📁 Repository Notes
- Code in `code/` at repo root
- Deploy via `/deploy` skill
- No MCP — all interaction via curl to Screeps REST API
- Active room: **E48N11** on **shard3**
- Spawn: **Romulus** (Spawn1) at (20,19)
- Source b526 at (38,13), source b527 at (30,46)
- Screeps token available as `$SCREEPS_TOKEN` in environment
- Branch: `claude/screeps-improvements-LpFuZ`

# Screeps Evolution State

## 🎯 Current High-Level Objective
- Fill storage to 20k+ to enable full senator scaling, then push to RCL6

## 📊 Last Known State (UTC: 2026-03-19T15:10:00Z)
- **RCL:** 5 (controller progress: 133,662 / ~150,000 ≈ ~89%)
- **GCL:** 2 (1,488,569 pts)
- **Economy:** RECOVERING — tower 327/1000 (was 7!), extensions 20/30 built,
  50/1000 extension fill, storage still 0 but energy is now flowing correctly
- **Threat Level:** Low (no hostiles)
- **Pop:** 12 creeps — 8 Legio, 2 Senator, 2 Archi (bodies mostly [WCM]/[WWCMM])

## 🧠 Strategic Handover
- **Last Session Actions:**
  1. Diagnosed root cause of death spiral: hash-based source selection sent 6/8
     legionnaires to same source — fixed to `findClosestByPath`
  2. Tower was starving at 7/1000 because extensions had priority — fixed with
     emergency tower fill (< 300 threshold) at top of legionnaire logic
  3. Senators were draining sources during recovery — fixed with idle guard
     (park near controller when storage < 2k AND avail < 400)
  4. Raised partial spawn minimum 250→550 so dying legionnaires get replaced
     with proper [WWCCCMMMM] bodies, not [WCM] — breaks the body-size death spiral
  5. Placed 10 extension construction sites (now 30 total when built, at RCL5 cap)
  6. Placed road gap tiles near source b526: (37,11), (38,12), (38,11)
  7. Removed screeps/ submodule, removed screeps MCP, added skill commands,
     rewrote CLAUDE.md for autonomous operation

- **Current Blocker:** None. Energy flowing, tower recovering.

- **Next Logic Gate:**
  1. Tower hits 1000 → no more emergency fill, all legionnaire energy to extensions
  2. Extensions fill to 550+ → first proper [WWCCCMMMM] replacement spawned
  3. Storage starts accumulating → senators un-idle and begin upgrading
  4. Storage > 20k → senator cap lifts, scale to 4 senators
  5. Storage > 50k → place second tower construction site
  6. RCL6 → new structure tier unlocks

## 🛠 Active Tasks
- [x] Fix source distribution (findClosestByPath)
- [x] Fix tower emergency priority in legionnaire
- [x] Fix senator idle during economy crisis
- [x] Raise partial spawn minimum to 550 (no more [WCM] replacements)
- [x] Place 10 extension construction sites (30 total at RCL5 cap)
- [x] Place road gap tiles near source b526
- [ ] Monitor: confirm first 550+ body spawns on next legionnaire death
- [ ] Roads: fill remaining gaps in south route to source b527
- [ ] When storage > 50k: place second tower site
- [ ] When RCL6: evaluate new structure placement

## 📁 Repository Notes
- Code in `code/` at repo root (submodule removed this session)
- Deploy via `POST /api/user/code` or `/deploy` skill
- No MCP — all interaction via curl to Screeps REST API
- Active room: **E48N11** on **shard3**
- Spawn: **Romulus** at (20,19)
- Source b526 at (38,13), source b527 at (30,46)
- Screeps token available as `$SCREEPS_TOKEN` in environment

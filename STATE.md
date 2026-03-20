# Screeps Evolution State

## 🎯 Current High-Level Objective
- Fill storage to 20k+ to enable full senator scaling, then push to RCL6

## 📊 Last Known State (UTC: 2026-03-20T00:45:00Z)
- **RCL:** 5 (controller progress: 135,196 / ~150,000 ≈ ~90%)
- **GCL:** 2 (1,490,603 pts)
- **Economy:** RECOVERING — tower 302/1000 (borderline), 20 extensions built,
  avail 162/1300 (12%), storage 0, energy slowly flowing into extensions
- **Threat Level:** None (no hostiles)
- **Pop:** 13 creeps — 8 Legio [WWCMM], 2 Senator [WCM] (idled), 3 Archi [WCM]

## 🧠 Strategic Handover
- **This Session Actions:**
  1. Diagnosed spawn blockage: with cap=1300 (20 extensions), avail=162.
     The partial-spawn threshold was 550 → tried to spawn 1300-cost body → ERR_NOT_ENOUGH_ENERGY.
     Legionnaires were not being replaced as they died (emergency bootstrap at <3 was too late).
  2. Fixed: lowered partial-spawn threshold from 550 → 350 for legionnaires/architects.
     Senators keep 550 minimum to avoid [WCM] upgraders. Deployed + pushed to git.
  3. Confirmed 8 legionnaires at target after fix deployed.
  4. Senators correctly idled (storage=0, avail=162 < 400 threshold).
  5. 10 extension construction sites still pending (1 at 2008/3000, 9 at 0/3000).
  6. 1 road site at (30,34) pending.

- **Current Blocker:** Slow extension fill — 14 of 20 extensions empty.
  With [WWCMM] carry cap of 50, legionnaires make many short trips.
  Once avail crosses 350+, new legio bodies will spawn when replacements needed.

- **Root Cause of Slow Fill:** 8 legios + 3 archis all harvesting from 2 sources
  (20 energy/tick regen). Effective net delivery ~8-12 energy/tick into extensions.
  ~1138 energy needed to fill remaining capacity → ~95-140 ticks to reach full cap.

- **Next Logic Gate:**
  1. avail ≥ 350 → next replacement legio can spawn [WWCMM] (threshold fix live)
  2. avail ≥ 550 → next replacement legio spawns [WWCCCMMMM] (better body)
  3. avail ≥ 1300 (cap full) → best body spawns (800-1300 cost)
  4. Extensions all built (30 total) → cap rises further, bigger bodies possible
  5. Storage fills → senators un-idle and begin upgrading
  6. Storage > 20k → senator cap lifts, scale to 4 senators
  7. Storage > 50k → place second tower construction site
  8. RCL6 → new structure tier unlocks

## 🛠 Active Tasks
- [x] Fix source distribution (findClosestByPath)
- [x] Fix tower emergency priority in legionnaire
- [x] Fix senator idle during economy crisis
- [x] Fix spawn blockage: lower partial-spawn threshold 550→350 for legionnaires
- [x] Place 10 extension construction sites (30 total at RCL5 cap)
- [x] Place road gap tiles near source b526
- [ ] Monitor: confirm [WWCCCMMMM] bodies appear when avail consistently >550
- [ ] Roads: fill remaining gaps in south route to source b527 (site at 30,34 pending)
- [ ] When storage > 50k: place second tower site
- [ ] When RCL6: evaluate new structure placement

## 📁 Repository Notes
- Code in `code/` at repo root
- Deploy via `POST /api/user/code` or `/deploy` skill
- No MCP — all interaction via curl to Screeps REST API
- Active room: **E48N11** on **shard3**
- Spawn: **Spawn1** at (20,19)
- Source b526 at (38,13), source b527 at (30,46)
- Screeps token available as `$SCREEPS_TOKEN` in environment

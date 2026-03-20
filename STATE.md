# Screeps Evolution State

## 🎯 Current High-Level Objective
- Fill storage to 10k+ → un-idle senators → scale to 4 senators → push RCL6

## 📊 Last Known State (UTC: 2026-03-20T02:30:00Z)
- **Tick:** 78,732,456
- **RCL:** 5 — progress 136,289 / **1,215,000** (11.2% — requires 1.2M total, not 150k)
- **GCL:** 2
- **Economy:** Recovering — avail 700/1300 (54%), storage 0, tower 322/1000
- **Threat Level:** None
- **Pop:** 14 creeps
  - 8 Legio: 7× [WWCMM], 1× [WWCCCMMMM] (first new-body spawn confirmed!)
  - 2 Senator: [WWWWCMM] (4 WORK each — 4×/tick upgrade rate per senator)
  - 4 Archi: [WCM] — all dying within 100–240 ticks → will auto-replace w/ [WWCCMMMM]

## 🧠 Strategic Handover
- **Session Actions:**
  1. Diagnosed spawn blockage: cap=1300, avail=162, threshold was 550 → blocked spawning.
     Fix: lowered partial-spawn threshold 550→350 for legionnaires/architects. Deployed + pushed.
  2. Retrieved live Memory diagnostics (console GET not supported; used Memory injection).
  3. Confirmed fix working — 8 legios at target, first [WWCCCMMMM] body seen.
  4. Noted RCL6 requires 1,215,000 energy (not 150k). Senators at 4W each = 8 upgrade/tick
     total, but carry cap (50) limits effective throughput to ~1 upgrade_energy/tick per senator.
     Scaling to 4 senators when storage > 20k will 2× the upgrade rate.

- **Economy Model:**
  - Sources: 2 × 10/tick regen = 20 energy/tick available
  - Consumers: 8 legios (16W) + 4 archis (4W) + 2 senators (8W) = 28W capacity
  - Carry-cap limited → actual throughput ~15/tick → sources sustainable
  - ~86 ticks to fill remaining extensions, then ~97 ticks to fill tower → storage begins
  - Senators NOT idled when avail > 400 (idle guard = storage < 2k AND avail < 400)

- **Next Logic Gates:**
  1. Archis die (within 240 ticks) → replaced with [WWCCMMMM] (2W), 2× build speed
  2. All 20 extensions full (avail ~1300) → tower starts filling
  3. Tower fills → legionnaires divert to storage
  4. Storage > 2k → senators guaranteed active even during low-avail ticks
  5. Storage > 10k → senator target scales to 4 (economyRecovering flips at 10k)
  6. Storage > 20k → senator cap lifts from 550 → 800 body tier
  7. Storage > 50k → place second tower site
  8. 10 new extensions finish building (30 total) → cap rises to 1800
  9. RCL6 at 1,215,000 upgrade energy

## 🛠 Active Tasks
- [x] Fix source distribution (findClosestByPath)
- [x] Fix tower emergency priority in legionnaire
- [x] Fix senator idle during economy crisis
- [x] Fix spawn blockage: lower partial-spawn threshold 550→350 for legionnaires
- [x] Place 10 extension construction sites (30 total at RCL5 cap)
- [x] Place road gap tiles near source b526
- [x] Confirmed [WWCCCMMMM] legio body spawning via threshold fix
- [ ] Monitor: storage accumulation — flag when > 2k, 10k, 20k
- [ ] When storage > 50k: place second tower construction site
- [ ] Consider controller container site once 10 new extensions are built (speeds senator cycle)
- [ ] When RCL6: evaluate new structure tier placement

## 📁 Repository Notes
- Code in `code/` at repo root
- Deploy via `POST /api/user/code` or `/deploy` skill
- No MCP — all interaction via curl to Screeps REST API
- Active room: **E48N11** on **shard3**
- Spawn: **Spawn1** at (20,19)
- Source b526 at (38,13), source b527 at (30,46)
- Screeps token available as `$SCREEPS_TOKEN` in environment
- My user ID: `5a1a6284ea05726462340d97`

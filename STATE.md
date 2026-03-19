# Screeps Evolution State

## 🎯 Current High-Level Objective
- Recover from economy death spiral at RCL5, rebuild storage buffer, reach RCL6

## 📊 Last Known State (UTC: 2026-03-19T14:30:00Z)
- **RCL:** 5 (controller progress: 133,171 / ~150,000 to RCL6 ≈ ~89%)
- **GCL:** 2 (1,488,569 pts, ~11% toward GCL 3)
- **Economy:** CRITICAL — storage at 0 energy, extensions mostly empty, tower at 7 energy
- **Threat Level:** Low (0 creeps lost in last 8 intervals)
- **Pop Status:** 9 creeps total (6 Legio, 2 Senator, 1 legacy upgrader) — all tiny [W,C,M] bodies

## 🧠 Strategic Handover
- **Last Action:** Deployed fix for economy death spiral. Lowered partial spawn threshold 400→250
  energy, capped senator body to 550 during recovery, raised Legionnaire target 6→8 when
  storage<10k. Fix deployed directly via Screeps API (GitHub push unavailable).
- **Current Blocker:** None for code. Submodule (Creep04/screeps) can't be pushed — deployed via API.
- **Next Logic Gate:** Wait ~100 ticks for spawn cycle. Check if legionnaires are spawning at
  550-energy size ([W,W,C,C,C,M,M,M,M]). Once 8 proper legionnaires exist, storage should fill.
  When storage > 20k, senators can scale up.

## 🛠 Active Tasks
- [x] Deployed death-spiral fix (partial spawn threshold + economy-aware senator cap)
- [ ] Monitor: confirm new creeps spawn at 550+ energy cost, not tiny 200 bodies
- [ ] Place 10 missing extension construction sites (RCL5 allows 30, we have 20)
- [ ] When storage > 50k: consider adding 2nd tower construction site

## 📁 Repository Notes
- `screeps/code/main.js`: Primary loop entry (synced to Screeps).
- `screeps/` is a git submodule pointing to Creep04/screeps — deploy via `POST /api/user/code`.
- `sandbox/`: Working area for agent scripts and raw data.
- Screeps token available as `$SCREEPS_TOKEN` in environment.
- Active room: **E48N11** on **shard3**.

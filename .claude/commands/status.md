Check the live Screeps game state for all active rooms.

Use curl with the SCREEPS_TOKEN env var to call the Screeps API and report:
1. User overview: active rooms, GCL, CPU usage
2. For each active room: RCL, controller progress, storage energy, tower energy, creep count by role, construction sites pending, any hostile creeps present
3. Recent energy stats (last 8 intervals): harvested, to control, to construction, to creeps

Use these endpoints:
- GET https://screeps.com/api/user/overview?statName=energyHarvested&interval=8
- GET https://screeps.com/api/game/room-objects?room=ROOM&shard=SHARD

Summarize findings concisely. Flag any critical issues (empty storage, low tower, hostiles, death spiral indicators).

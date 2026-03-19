Show a detailed breakdown of a specific Screeps room. If no room is specified, use the primary active room from STATE.md.

Fetch and display:
1. All structures: type, position, hits, store contents
2. All creeps: name, role (from memory), body parts, hits, position
3. All construction sites: type, position, progress
4. Sources: position, energy remaining, capacity
5. Mineral: type, amount, extractor status

Use:
- GET https://screeps.com/api/game/room-objects?room=ROOM&shard=SHARD

Identify and flag:
- Structures below 50% hits
- Creeps with sub-optimal body compositions for current RCL
- Missing structures for the current RCL (e.g. not enough extensions)
- Any foreign creeps (different owner)

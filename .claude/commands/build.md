Place a construction site in the active Screeps room via the API.

Usage: /build STRUCTURE_TYPE X Y [ROOM] [SHARD]
If ROOM/SHARD are omitted, use the primary room from STATE.md.

Valid structure types: extension, tower, container, road, storage, extractor, lab, terminal, observer, rampart, constructedWall, powerSpawn, nuker, factory, link, spawn

Steps:
1. Confirm the structure type and coordinates
2. POST to https://screeps.com/api/game/place-construction-site with body:
   `{ "room": "ROOM", "x": X, "y": Y, "structureType": "TYPE", "shard": "SHARD" }`
   Headers: `X-Token: $SCREEPS_TOKEN`, `Content-Type: application/json`
3. Report success or error

Before placing, check if the position is valid (not a wall, not already occupied).

Fetch and display recent Screeps console output for the active shard.

Use curl with SCREEPS_TOKEN to call:
- GET https://screeps.com/api/user/console?shard=shard3 (or the appropriate shard from STATE.md)

Display the last 50 log lines. Highlight:
- Any ERROR or error lines
- Any spawn events
- Any combat/hostile events
- CPU limit warnings

If there are errors in the console, analyze them and suggest fixes.

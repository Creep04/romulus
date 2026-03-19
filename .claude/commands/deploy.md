Deploy the current code from the `code/` directory to the live Screeps game.

Steps:
1. Read all .js files from `code/` — each filename (without .js) becomes the module name
2. Build the JSON payload: `{ "branch": "default", "modules": { "moduleName": "fileContents", ... } }`
3. POST to https://screeps.com/api/user/code with header `X-Token: $SCREEPS_TOKEN`
4. Confirm success (response should contain `"ok":1`)
5. Report which modules were deployed and their sizes

If the deploy fails, show the error response and do not proceed.
After a successful deploy, note that changes take effect on the next game tick.

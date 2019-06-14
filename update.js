#!/usr/bin/env node
const { spawnSync } = require("child_process");
const options = { stdio: "inherit", shell: true };
spawnSync(
  `
  git stash
  rm -f package-lock.json
  git pull origin master
  npm install
  pm2 reload pm2.config.json
`,
  options
);

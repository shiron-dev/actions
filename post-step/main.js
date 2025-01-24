const { spawn } = require("child_process");
const { appendFileSync } = require("fs");
const { EOL } = require("os");

function run(cmd) {
  const subprocess = spawn(cmd, { stdio: "inherit", shell: true });
  subprocess.on("exit", (exitCode) => {
    process.exitCode = exitCode;
  });
}

const key = process.env.INPUT_KEY.toUpperCase();

if ( process.env[`STATE_${key}`] !== undefined ) {
  run(process.env.INPUT_POST);
} else {
  appendFileSync(process.env.GITHUB_STATE, `${key}=true${EOL}`);
  run(process.env.INPUT_RUN);
}

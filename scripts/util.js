import { ChildProcess, spawn } from "child_process";
import { platform } from "os";

/**
 *
 * @param {string} command
 * @param {string[]} args
 * @returns {Promise<ChildProcess>}
 */
export async function runCommand(command) {
  console.log("Running", command);
  /**
   * @type ChildProcess
   */
  let process;
  if (platform() == "win32") {
    process = spawn("cmd", ["/c"].concat(command.split(" ")), {
      stdio: "inherit",
    });
  } else {
    process = spawn(command, { shell: '/bin/bash' });
  }
  process.stdout.on('data', (data) => { console.log(Buffer.from(data).toString('utf-8')) })
  process.stderr.on('data', (data) => { console.log(Buffer.from(data).toString('utf-8')) })
  process.on("exit", (code) => {
    console.log(`Command ${command} exited with code ${code}`);
  });
  process.on("error", (err) => {
    console.log(console.log(Buffer.from(err).toString('utf-8')));
  });

  return process;
}

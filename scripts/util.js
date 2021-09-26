import { spawn } from "child_process";
import { platform } from "os";

/**
 *
 * @param {string} command
 * @param {string[]} args
 * @returns {Promise<void>}
 */
export async function runCommand(command) {
  console.log("Running", command);
  let process;
  if (platform() == "win32") {
    process = spawn("cmd", ["/c"].concat(command.split(" ")), {
      stdio: "inherit",
    });
  } else {
    process = spawn(command.split(" ")[0], command.split(" ").splice(0, 1));
  }
  // process.stdout.on('data', (data) => { console.log(data) })
  // process.stderr.on('data', (data) => { console.log(data) })
  process.on("exit", (code) => {
    console.log(`Command ${command} exited with code ${code}`);
  });
  process.on("error", (err) => {
    console.log(err);
  });
}

import { runCommand } from "./util.js";

const parcel = await runCommand("npx vite serve");
const firebase = await runCommand("npx firebase emulators:start");

function killAll() {
  parcel.kill();
  firebase.kill();
}

process.on("exit", killAll);
process.on("SIGINT", killAll);
process.on("SIGUSR1", killAll);
process.on("SIGUSR2", killAll);
process.on("uncaughtException", killAll);

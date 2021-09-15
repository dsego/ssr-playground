import { watch } from "./helpers/watcher.js";
import { colors } from "./deps.js";

const flags = [
  "--allow-env",
  "--allow-read",
  "--allow-net",
  "--unstable",
  "--no-check",
];
const script = "server.js";

const procStatus = async (proc) => {
  if (!await proc.status()) {
    console.log("Process error!");
  }
};

const run = () => {
  const proc = Deno.run({ cmd: ["deno", "run", ...flags, script] });
  procStatus(proc);
  return proc;
};

let ongoingProcess = run();

// Reload server when any file changes
await watch(".", async () => {
  ongoingProcess?.kill(Deno.Signal.SIGKILL);
  ongoingProcess?.close();
  console.log(colors.cyan("Restarting..."));
  ongoingProcess = run();
});

export async function watch(path, onChange, config = { interval: 500 }) {
  const watcher = Deno.watchFs(path);
  let reloading = false;

  for await (const event of watcher) {
    if (event.kind === "modify" && !reloading) {
      reloading = true;
      onChange(event);
      setTimeout(() => (reloading = false), config.interval);
    }
  }
}

deno run \
  --allow-run \
  --allow-env \
  --allow-read \
  --allow-write \
  --allow-net \
  --unstable \
  --no-check \
  --watch \
  --config ./config.json \
  --import-map=import_map.json \
  src/server.js

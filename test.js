const p = Deno.run({
  cmd: ["deno", "run", "/home/davorin/Code/playground/routes/Index.jsx"],
});

await p.status();

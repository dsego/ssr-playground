import {
  adapterFactory,
  colors,
  engineFactory,
  h,
  oak,
  organ,
  render,
  Snelm,
  viewEngine,
} from "./deps.js";
import { errorHandler } from "./middleware.js";
import resolve from "./helpers/resolve.js";

const isDev = Deno.env.get("APP_ENV") == "development";
const app = new oak.Application();

// -----------------------------------------------------------------------------

// Middleware

const coloring = true;
app.use(organ("tiny", coloring));

const snelm = new Snelm("oak");
app.use(async (ctx, next) => {
  ctx.response = snelm.snelm(ctx.request, ctx.response);
  await next();
});

const ejsEngine = engineFactory.getEjsEngine();
const oakAdapter = adapterFactory.getOakAdapter();
app.use(viewEngine(oakAdapter, ejsEngine, {
  viewRoot: `${Deno.cwd()}/templates/`,
  useCache: !isDev,
}));

app.use(errorHandler({ showExtra: isDev }));

// TODO compress

// -----------------------------------------------------------------------------

async function importNested(dir, dict) {
  for await (const entry of Deno.readDir(dir)) {
    if (entry.isFile) {
      const filepath = `${dir}/${entry.name}`;
      const imported = await import(filepath);
      dict[filepath] = imported.default;
    } else if (entry.isDirectory) {
      await importNested(`${dir}/${entry.name}`, dict);
    }
    // we are not handling symlinks
  }
}

// Import all page components
console.log(colors.bold("* Import JSX pages"));
const pageModules = {};
await importNested("./pages", pageModules);

// -----------------------------------------------------------------------------

// Router

const router = new oak.Router();
app.use(router.routes());
app.use(router.allowedMethods());

// Serve JSX components from the /pages directory
router.get("/:page*", async (ctx) => {
  const query = oak.helpers.getQuery(ctx);
  const modulePath = "./pages/" + resolve(ctx.params.page);

  if (!pageModules[modulePath]) {
    throw ctx.throw(404);
  }

  ctx.render("wrapper.html", {
    title: "asdf",
    body: render(h(pageModules[modulePath], { query })),
  });
});

// -----------------------------------------------------------------------------

// Start App
app.addEventListener("listen", ({ hostname, port }) => {
  console.log(
    colors.bold("* Listen on ") + colors.yellow(`http://${hostname}:${port}`),
  );
});

const hostname = "localhost";
const port = Number(Deno.env.get("PORT"));

await app.listen({ hostname, port });

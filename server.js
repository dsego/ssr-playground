import {
  adapterFactory,
  colors,
  engineFactory,
  h,
  oak,
  organ,
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
router.all("/:page*", async (ctx) => {
  const modulePath = "./pages/" + resolve(ctx.params.page);
  const component = pageModules[modulePath];

  if (!component) {
    throw ctx.throw(404);
  }

  const html = await component({ request: ctx.request });

  ctx.response.status = 200;
  ctx.response.type = "text/html";
  ctx.response.body = `<!DOCTYPE html>\n${html}`;
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

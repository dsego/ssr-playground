import {
  adapterFactory,
  colors,
  engineFactory,
  h,
  oak,
  organ,
  render,
  Snelm,
  viewEngine
} from "./deps.js";
import { errorHandler } from "./middleware.js";

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

// Router

const router = new oak.Router();
app.use(router.routes());
app.use(router.allowedMethods());


// Import all page components
const pageModules = {}
for await (const entry of Deno.readDir("./pages")) {
  const imported = await import(`./pages/${entry.name}`);
  pageModules[entry.name] = imported.default;
}

// Serve JSX components from the /pages directory
router.get("/:page?", async (ctx) => {
  const query = oak.helpers.getQuery(ctx);
  const params = ctx.params;
  const filename = params.page ?? 'Index.jsx';
  ctx.render("wrapper.html", {
    title: filename,
    body: render(h(pageModules[filename], { params, query })),
  });
});


// -----------------------------------------------------------------------------

// Start App
app.addEventListener("listen", ({ hostname, port }) => {
  console.log(
    colors.bold("Listening on ") + colors.yellow(`http://${hostname}:${port}`),
  );
});

const hostname = "localhost";
const port = Number(Deno.env.get("PORT"));

await app.listen({ hostname, port });


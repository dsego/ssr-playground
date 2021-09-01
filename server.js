import {
  colors,
  oak,
  organ,
  Snelm,
  Eta,
  EtaPluginDefer
} from "./deps.js";
import { errorHandler } from "./middleware.js";
import { resolve } from "./helpers/resolve.js";
import { fileLookup } from "./helpers/fileLookup.js";
import { Store } from "./stores/store.js";

const isDev = Deno.env.get("APP_ENV") == "development";
const app = new oak.Application();

// -----------------------------------------------------------------------------

const store = new Store()

const pagesDir = "pages";
const componentsDir = "components";

// Eta templates
Eta.configure({
  async: true,
  views: [pagesDir, componentsDir],
  cache: !isDev,
  plugins: [EtaPluginDefer]
})


// Middleware

const coloring = true;
app.use(organ("tiny", coloring));

const snelm = new Snelm("oak");
app.use(async (ctx, next) => {
  ctx.response = snelm.snelm(ctx.request, ctx.response);
  await next();
});


app.use(errorHandler({ showExtra: isDev }));

// TODO compress

// -----------------------------------------------------------------------------

const availablePages = await fileLookup(pagesDir)

// Router

const router = new oak.Router();
app.use(router.routes());
app.use(router.allowedMethods());

// Serve page components from the /pages directory
router.all("/:page*", async (ctx) => {
  const pageTemplate = resolve(ctx.params.page);
  const query = oak.helpers.getQuery(ctx);

  const key = `${pagesDir}/${pageTemplate}`;
  if (!availablePages[key]) {
    ctx.throw(404)
  }

  const html = await Eta.renderFileAsync(pageTemplate, {
    request: ctx.request,
    query,
    store
  });

  ctx.response.status = 200;
  ctx.response.type = "text/html";
  ctx.response.body = html
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

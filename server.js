import {
  colors,
  oak,
  organ,
  Snelm,
  h,
  renderJSX
} from "./deps.js";
import { errorHandler } from "./middleware.js";
import { resolve } from "./helpers/resolve.js";
import { fileLookup } from "./helpers/fileLookup.js";
// import { Store } from "./stores/store.js";

const isDev = true //Deno.env.get("APP_ENV") == "development";
const app = new oak.Application();

// -----------------------------------------------------------------------------

// const store = new Store()
const PAGE_DIR = "./pages";
const COMPONENT_DIR = "./components";


// Middleware

app.use(organ("tiny", { coloring: true }));

const snelm = new Snelm("oak");
app.use(async (ctx, next) => {
  ctx.response = snelm.snelm(ctx.request, ctx.response);
  await next();
});


app.use(errorHandler({ showExtra: isDev }));

// TODO compress

// -----------------------------------------------------------------------------

const pagesLookup = await fileLookup(PAGE_DIR)

// Import page components
const pageModules = {}
for  (const [key, _value] of Object.entries(pagesLookup)) {
  const imported = await import(key);
  pageModules[key] = imported.default;
}

// Router

const router = new oak.Router();
app.use(router.routes());
app.use(router.allowedMethods());

// Serve page components from the /pages directory
router.all("/:page*", async (ctx) => {
  const pageName = resolve(ctx.params.page);
  const query = oak.helpers.getQuery(ctx);

  const key = `${PAGE_DIR}/${pageName}`;
  const rootComponent = pageModules[key]
  if (!rootComponent) {
    ctx.throw(404)
  }

  const html = await renderJSX(
    h(rootComponent, {
      request: ctx.request,
      query,
      // store
    })
  );

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
// const port = Number(Deno.env.get("PORT"));
const port = 3000


await app.listen({ hostname, port });

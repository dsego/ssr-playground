import { colors, h, oak, organ, renderJSX, Snelm } from "./deps.js";
import { errorHandler } from "./middleware.js";
import { resolve } from "./helpers/resolve.js";
// import { Store } from "./stores/store.js";

const isDev = true; //Deno.env.get("APP_ENV") == "development";
const app = new oak.Application();

// -----------------------------------------------------------------------------

// const store = new Store()
const ROUTE_DIR = "./routes";

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

// Router

const router = new oak.Router();
app.use(router.routes());
app.use(router.allowedMethods());

// Serve page components from the /pages directory
router.all("/:page*", async (ctx) => {
  const pageName = resolve(ctx.params.page);
  const query = oak.helpers.getQuery(ctx);
  const imported = await import(`${ROUTE_DIR}/${pageName}`);
  const pageComponent = imported.default;

  if (!pageComponent) {
    ctx.throw(404);
  }

  const content = await renderJSX(
    h(pageComponent, {
      request: ctx.request,
      query,
      // store
    }),
  );

  ctx.response.status = 200;
  ctx.response.type = "text/html";
  ctx.response.body = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title></title>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/holiday.css@0.9.8" />
      <script src="https://unpkg.com/htmx.org@1.1.0"></script>
    </head>
    <body>
      ${content}
    </body>
    </html>
  `;
});

// -----------------------------------------------------------------------------

const hostname = "localhost";
const port = 3000;

// Start App
app.addEventListener("listen", ({ hostname, port }) => {
  console.log(
    colors.bold("* Listen on ") + colors.yellow(`http://${hostname}:${port}`),
  );
});

await app.listen({ hostname, port });


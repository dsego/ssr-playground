import { colors, h, logger, oak, renderJSX, Snelm } from "./deps.js";
import { errorHandler } from "./middleware.js";
import { resolve } from "./helpers/resolve.js";

const isDev = true; //Deno.env.get("APP_ENV") == "development";
const app = new oak.Application();


// Make our JSX transform function available everywhere (see config.json)
globalThis._h = h


const ROUTE_DIR = "../routes";

// Middleware

app.use(logger.logger);
app.use(logger.responseTime);

const snelm = new Snelm("oak");
app.use(async (ctx, next) => {
  ctx.response = snelm.snelm(ctx.request, ctx.response);
  await next();
});

app.use(errorHandler({ showExtra: isDev }));

// TODO compress


// -----------------------------------------------------------------------------
// Router
// -----------------------------------------------------------------------------

const router = new oak.Router();
app.use(router.routes());
app.use(router.allowedMethods());

// Serve page components from the /pages directory
router.all("/:page*", async (ctx) => {
  const { params, request } = ctx;
  const pageName = resolve(params.page);
  let path = `${ROUTE_DIR}/${pageName}`;

  // Cache bust imported module
  if (isDev) {
    path += `?v=${Date.now()}`;
  }
  const imported = await import(path);
  const pageComponent = imported.default;

  if (!pageComponent) {
    ctx.throw(404);
  }

  const query = oak.helpers.getQuery(ctx);

  const form = {};
  if (request?.hasBody) {
    const body = request.body();
    if (body.type === "form") {
      const urlencoded = await body.value;
      for (const [key, value] of urlencoded) {
        form[key] = value;
      }
    }
  }

  const content = await renderJSX(
    h(pageComponent, {
      request,
      query,
      form,
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
      <script src="https://unpkg.com/htmx.org@1.6.1"></script>
      <script>
        const source = new EventSource("//localhost:8000/sse");
        source.addEventListener("refresh", (e) => {
          console.log("reloading")
          setTimeout(() => {
            location.reload()
          }, 500)
        });
      </script>
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

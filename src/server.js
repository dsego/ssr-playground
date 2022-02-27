import { colors, Fragment, h, logger, oak, renderJSX, Snelm } from "./deps.js";
import routeLookup from "./routes.jsx";

const app = new oak.Application();

// Make our JSX transform function available everywhere (see config.json)
globalThis._h = h;
globalThis.Fragment = Fragment;

// ---------------------
// Middleware
// ---------------------

app.use(logger.logger);
app.use(logger.responseTime);

const snelm = new Snelm("oak");
app.use(async (ctx, next) => {
  ctx.response = snelm.snelm(ctx.request, ctx.response);
  await next();
});
// TODO compress

// Load & watch the HTML template
const templatePath = `${Deno.cwd()}/src/template.html`;
let template = await Deno.readTextFile(templatePath);
const watcher = Deno.watchFs(templatePath);
(async () => {
  for await (const event of watcher) {
    if (event.kind === "modify") {
      template = await Deno.readTextFile(templatePath);
    }
  }
})();

// ---------------------
// Router
// ---------------------

function resolve(handler) {
  return async (ctx) => {
    const jsx = await handler(ctx);
    const content = await renderJSX(jsx);
    ctx.response.status = 200;
    ctx.response.type = "text/html";

    // for XHR requests driven by HTMX
    const isHtmxDrivenRequest = ctx.request.headers.has("HX-Request");
    if (isHtmxDrivenRequest) {
      ctx.response.body = content;
      return;
    }

    // render full HTML template
    ctx.response.body = template.replace("[content]", content);
  };
}

const router = new oak.Router();
app.use(router.routes());
app.use(router.allowedMethods());

// static assets (css ,js, images)
router.get("/assets/:path+", async (ctx) => {
  console.log(ctx.request.url.pathname);
  await oak.send(ctx, ctx.request.url.pathname, { root: Deno.cwd() });
});

// JSX component routes
for (const route in routeLookup) {
  router.all(route, resolve(routeLookup[route]));
}

// ---------------------
// Start App
// ---------------------

app.addEventListener("listen", ({ port }) => {
  console.log(
    colors.bold("=> Listen on ") + colors.yellow(`http://localhost:${port}`),
  );
});

const port = 3000;
await app.listen({ port });

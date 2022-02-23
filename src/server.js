import { colors, h, Fragment, logger, oak, renderJSX, Snelm } from "./deps.js";
import routeLookup from "./routes.jsx";

const app = new oak.Application();

// Make our JSX transform function available everywhere (see config.json)
globalThis._h = h
globalThis.Fragment = Fragment


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


// ---------------------
// Router
// ---------------------

const template = await Deno.readTextFile(`${Deno.cwd()}/src/template.html`);

function resolve(handler) {
  return async (ctx) => {
    const jsx = await handler(ctx);
    const content = await renderJSX(jsx);
    ctx.response.status = 200;
    ctx.response.type = "text/html";
    ctx.response.body = template.replace('[content]', content);
  }
}

const router = new oak.Router();
app.use(router.routes());
app.use(router.allowedMethods());

for (const route in routeLookup) {
  router.all(route, resolve(routeLookup[route]))
}

router.get("/assets/:path+", async (ctx) => {
  console.log(ctx.request.url.pathname)
  await oak.send(ctx, ctx.request.url.pathname, { root: Deno.cwd() });
});


// ---------------------
// Start App
// ---------------------

const hostname = "localhost";
const port = 3000;


app.addEventListener("listen", ({ hostname, port }) => {
  console.log(
    colors.bold("* Listen on ") + colors.yellow(`http://${hostname}:${port}`),
  );
});

await app.listen({ hostname, port });

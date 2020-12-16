import { colors, h, oak, organ, render, Snelm } from "./deps.js";
import { errorHandler, notFound } from "./middleware.js";
import { App } from "./views/App.jsx";

const port = Number(Deno.env.get("PORT"));
const isDev = Deno.env.get("APP_ENV") == "development";

const app = new oak.Application();

// Logger
const coloring = true;
app.use(organ("tiny", coloring));

// Security middleware
const snelm = new Snelm("oak");
app.use((ctx, next) => {
  ctx.response = snelm.snelm(ctx.request, ctx.response);
  next();
});

// Catch errors
app.use(errorHandler({ showExtra: isDev }));

// Router
const router = new oak.Router();
app.use(router.routes());
app.use(router.allowedMethods());

app.use(notFound);

router.get("/", (ctx) => {
  ctx.response.body = `<html><body>${render(h(App))}</body></html>`;
});

app.addEventListener("listen", ({ hostname, port }) => {
  console.log(
    colors.bold("Start listening on ") + colors.yellow(`${hostname}:${port}`),
  );
});

await app.listen({ hostname: "127.0.0.1", port });

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
  open
} from "./deps.js";
import { errorHandler } from "./middleware.js";
import { App } from "./components/App.jsx";


const isDev = Deno.env.get("APP_ENV") == "development";
const app = new oak.Application();

// -----------------------------------------------------------------------------

// Middleware

const coloring = true;
app.use(organ("tiny", coloring));

const snelm = new Snelm("oak");
app.use((ctx, next) => {
  ctx.response = snelm.snelm(ctx.request, ctx.response);
  next();
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

router.get("/", (ctx) => {
  ctx.render("wrapper.html", {
    title: "App",
    body: render(h(App)),
  });
});

// -----------------------------------------------------------------------------

// Start App
app.addEventListener("listen", ({ hostname, port }) => {
  console.log(
    colors.bold("Start listening on ") + colors.yellow(`${hostname}:${port}`),
  );
  if (isDev && Deno.env.get('browser_opened') !== 'Y') {
    Deno.env.set('browser_opened', 'Y');
    open(`${hostname}:${port}`);
  }
});

const hostname = "127.0.0.1";
const port = Number(Deno.env.get("PORT"));

await app.listen({ hostname, port });


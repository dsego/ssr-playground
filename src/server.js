import { colors, Fragment, h, logger, oak, renderJSX, Snelm } from "./deps.js";
import { routes } from "./routes.js";

const app = new oak.Application();

// Make our JSX transform function available everywhere (see config.json)
globalThis._h = h;
globalThis.Fragment = Fragment;

// ------------------------------------------
//  Middleware
// ------------------------------------------

app.use(logger.logger);
app.use(logger.responseTime);

const snelm = new Snelm("oak");
// await snelm.init();
// app.use((ctx, next) => {
//   ctx.response = snelm.snelm(ctx.request, ctx.response);
//   next();
// });
// TODO compress + other middleware


// ------------------------------------------
//  Rendering setup
// ------------------------------------------

// Load & watch the main HTML template
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

// Render JSX content to our HTML template
async function render(ctx, jsx, options = {
  partial: false
}) {
  const content = await renderJSX(jsx);
  // render partial HTML fragments
  if (options.partial) {
    ctx.response.body = content;
    return;
  }

  // render full HTML template
  ctx.response.body = template.replace("[content]", content);
}

// Create a render method on context
app.use(async (ctx, next) => {
  ctx.render = async (jsx, options) => {
    await render(ctx, jsx, options);
  }
  await next();
})




// ------------------------------------------
//  Register routes
// ------------------------------------------

routes(app)




// ------------------------------------------
//  Start App
// ------------------------------------------

app.addEventListener("listen", ({ port }) => {
  console.log(
    colors.bold("=> Listen on ") + colors.yellow(`http://localhost:${port}`),
  );
});

const port = 3000;
await app.listen({ port });

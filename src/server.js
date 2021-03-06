import { colors, Fragment, h, logger, oak, renderJSX, Sqlite } from "./deps.js";
import { routes } from "./routes.js";
import { generateFakeProfile } from "./fake.js";
import { ProfileStore } from "./store.js";

// Make our JSX transform function available everywhere (see config.json)
globalThis.h = h;
globalThis.Fragment = Fragment;

const app = new oak.Application();

// -----------------------------------------------------------------------------
// Generate some demo profiles
// -----------------------------------------------------------------------------
const sql = await Deno.readTextFile(`${Deno.cwd()}/sql/profile.sql`);
const db = new Sqlite(":memory:");
await db.execute(sql);
const profileStore = new ProfileStore(db);
for (let i = 0; i < 30; ++i) {
  try {
    profileStore.create(generateFakeProfile());
  } catch (err) {
    continue;
  }
}

// -----------------------------------------------------------------------------
//  Middleware
// -----------------------------------------------------------------------------

// TODO: snelm?
app.use(logger.logger);
app.use(logger.responseTime);
app.use((ctx, next) => {
  ctx.store = profileStore;
  return next();
});

// -----------------------------------------------------------------------------
//  Rendering setup
// -----------------------------------------------------------------------------

// Load & watch the main HTML template
// TODO: support having multiple templates
const templatePath = `${Deno.cwd()}/src/templates/main.html`;
let mainTemplate = await Deno.readTextFile(templatePath);
const watcher = Deno.watchFs(templatePath);
(async () => {
  let timeout;
  for await (const event of watcher) {
    if (event.kind === "modify") {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(async () => {
        mainTemplate = await Deno.readTextFile(templatePath);
      }, 200);
    }
  }
})();

// A method to render JSX content and insert it into our HTML template
async function render(ctx, jsx, options = {
  partial: false,
  template: mainTemplate,
}) {
  const content = await renderJSX(jsx);
  // render partial HTML fragments
  if (ctx.request.headers.has("HX-Request")) {
    ctx.response.body = content;
    return;
  }

  // render full HTML template
  ctx.response.body = options.template.replace("[content]", content);
}

// Create a render method on context
app.use(async (ctx, next) => {
  ctx.render = async (jsx, options) => {
    await render(ctx, jsx, options);
  };
  await next();
});

// -----------------------------------------------------------------------------
//  Register routes
// -----------------------------------------------------------------------------

routes(app);

// -----------------------------------------------------------------------------
//  Start the app
// -----------------------------------------------------------------------------

app.addEventListener("listen", ({ port }) => {
  console.log(
    colors.bold("=> Listen on ") + colors.yellow(`http://localhost:${port}`),
  );
});

const port = 3000;
await app.listen({ port });

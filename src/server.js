import {
  colors,
  Fragment,
  h,
  logger,
  oak,
  renderJSX,
  Session,
  Sqlite,
} from "./deps.js";
import { routes } from "./routes.js";
import { generateFakeProfiles } from "./fake.js";
import { ProfileStore } from "./store.js";

const app = new oak.Application();
const session = new Session();

// Make our JSX transform function available everywhere (see config.json)
globalThis._h = h;
globalThis.Fragment = Fragment;

// -----------------------------------------------------------------------------
//  Middleware
// -----------------------------------------------------------------------------

// TODO: snelm?
app.use(logger.logger);
app.use(logger.responseTime);
app.use(session.initMiddleware());

app.use(async (ctx, next) => {
  if (await ctx.state.session.has("db")) {
    const db = await ctx.state.session.get("db");
    ctx.state.profileStore = new ProfileStore(db);
  } else {
    const db = new Sqlite(":memory:");
    await ctx.state.session.set("db", db);
    const profileStore = new ProfileStore(db);
    await db.query(await Deno.readTextFile(`${Deno.cwd()}/sql/profiles.sql`));
    await generateFakeProfiles(profileStore, 30);
    console.log(colors.magenta("=> Generated fake data."));
    ctx.state.profileStore = profileStore;
  }
  await next();
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

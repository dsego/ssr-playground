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
import { generateFakeProfile } from "./fake.js";
import { ProfileStore } from "./store.js";

const app = new oak.Application();
const session = new Session(undefined, {
  expireAfterSeconds: 5 * 60, // 5 minutes
});

// Generate some demo profiles
const sql = await Deno.readTextFile(`${Deno.cwd()}/sql/profile.sql`);
const db = new Sqlite(":memory:");
await db.query(sql);
const profileStore = new ProfileStore(db);
for (let i = 0; i < 30; ++i) {
  try {
    profileStore.create(generateFakeProfile());
  } catch (err) {
    continue;
  }
}

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

// setInterval(async () => {
//   for (let [sid, db] of dbMap.entries()) {
//     const isValid = await session.sessionValid(sid)
//     if (!isValid) {
//       db.close()
//       await session.deleteSession(sid)
//       dbMap.delete(sid)
//     }
//   }
// }, 5000);

// Generate an independent in-memory sqlite data store for each new session
app.use(async (ctx, next) => {
  // if (dbMap.has(ctx.state.sessionID)) {
  // const db = dbMap.get(ctx.state.sessionID);
  // ctx.state.profileStore = new ProfileStore(db);
  // } else {
  // const db = new Sqlite(":memory:");
  // dbMap.set(ctx.state.sessionID, db);
  // await db.query(sql);
  // const profileStore = new ProfileStore(db);

  // await Promise.all(generateFakeProfiles(30).map((data) => profileStore.create(data)));
  // await Promise.all(.map((data) => profileStore.create(data)));
  // generateFakeProfile()
  // ctx.state.profileStore = profileStore;
  // }
  // console.log(colors.magenta("=> Generated fake data."));
  ctx.state.profileStore = profileStore;
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

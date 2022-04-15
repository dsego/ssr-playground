import { oak } from "./deps.js";
import { router as profileList } from "./views/profileList.jsx";
import { router as profileDetails } from "./views/profileDetails.jsx";
import { router as profileEdit } from "./views/profileEdit.jsx";

export function routes(app) {

  // Serve static assets (css ,js, images)
  const router = new oak.Router()
    .get("/assets/:path+", async (ctx) => {
      await oak.send(ctx, ctx.request.url.pathname, {
        root: Deno.cwd(),
      });
    });

  router.get("/", (ctx) => ctx.response.redirect("/profiles"));

  app.use(router.routes(), router.allowedMethods());

  // Views
  app.use(profileList.routes(), profileList.allowedMethods());
  app.use(profileDetails.routes(), profileDetails.allowedMethods());
  app.use(profileEdit.routes(), profileEdit.allowedMethods());
}

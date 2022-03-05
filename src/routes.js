import {oak} from "./deps.js"
// import { UserDetails } from "./views/UserDetails.jsx";
// import { UserEdit } from "./views/UserEdit.jsx";
import { RoutePaths } from "./routePaths.js";
import { router as memberList } from "./views/memberList.jsx";
import { router as memberEdit } from "./views/memberEdit.jsx";


export function routes(app) {

  // Serve static assets (css ,js, images)
  const router = new oak.Router()
    .get("/assets/:path+", async (ctx) => {
      await oak.send(ctx, ctx.request.url.pathname, {
        root: Deno.cwd()
      });
    });

  // Redirect / to /members
  router.get(RoutePaths.HOME, (ctx) => {
    ctx.response.redirect(RoutePaths.MEMBER.LIST)
  })

  app.use(router.routes(), router.allowedMethods());

  // Views
  app.use(memberList.routes(), memberList.allowedMethods())
  app.use(memberEdit.routes(), memberEdit.allowedMethods())

  // Not Found - catch all
  // router.all("(.*)", )

}


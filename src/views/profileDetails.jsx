import { insane, marked, oak } from "../deps.js";
import { RoutePaths } from "../routePaths.js";
import * as store from "../store.js";
import { jobColor } from "../helpers.js";
import { Badge } from "../components/Badge.jsx";

export const router = new oak.Router()
  .get(RoutePaths.PROFILE.VIEW, profileDetails);

export async function profileDetails(ctx) {
  const profile = await store.profiles.findBy("pid", ctx.params.id);

  if (!profile) ctx.throw(404);

  await ctx.render(
    <>
      <nav>
        <a href={RoutePaths.PROFILE.LIST}>◀ Back</a>
      </nav>
      <article>
        <header>
          <h3>{profile.name}</h3>
          <img src={profile.avatar} />
          <p>
            <Badge color={await jobColor(profile.job)}>{profile.job}</Badge>
          </p>
        </header>
        <section
          dangerouslySetInnerHTML={{
            __html: insane(marked.parse(profile.bio)),
          }}
        />
      </article>
    </>,
  );
}

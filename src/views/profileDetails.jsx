import { oak } from "../deps.js";
import { RoutePaths } from "../routePaths.js";
import * as store from "../store.js";

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
          <p>{profile.job}</p>
        </header>
        <section>
          {profile.bio}
        </section>
      </article>
    </>,
  );
}

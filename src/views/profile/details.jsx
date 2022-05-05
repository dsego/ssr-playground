/** @jsx h */
/** @jsxFrag Fragment */

import { insane, marked, oak } from "../../deps.js";
import { Icon } from "../../partials/Icon.jsx";

export const router = new oak.Router()
  .get("/profiles/:id", profileDetails);

export async function profileDetails(ctx) {
  const profile = await ctx.store.findBy("pid", ctx.params.id);

  if (!profile) ctx.throw(404);

  await ctx.render(
    <article>
      <header class="article-header">
        {profile.avatar && <img class="avatar-w-shadow" src={profile.avatar} />}
        <div>
          <h2 class="m-0 mb-lg">{profile.name}</h2>
          <p class="m-0 mb-xs">
            {profile.email}
          </p>
          <p class="muted m-0">
            {profile.job && <Icon name="profile-circled" />}
            {profile.job}
          </p>
          <p class="muted m-0">
            {profile.city && <Icon name="city" />}
            {profile.city}
          </p>
        </div>
      </header>
      <section
        dangerouslySetInnerHTML={{
          __html: insane(marked.parse(profile.bio ?? "")),
        }}
      />
    </article>,
  );
}

import { insane, marked, oak } from "../../deps.js";
import * as store from "../../store.js";
import { Icon } from "../../partials/Icon.jsx";

export const router = new oak.Router()
  .get("/profiles/:id", profileDetails);

export async function profileDetails(ctx) {
  const profile = await store.profiles.findBy("pid", ctx.params.id);

  if (!profile) ctx.throw(404);

  await ctx.render(
    <article>
      <header class="article-header">
        {profile.avatar && <img class="avatar-w-shadow" src={profile.avatar} />}
        <div>
          <h2 class="m-0">{profile.name}</h2>
          <p>
            {profile.email}
          </p>
          <p class="muted">
            {profile.job && <Icon name="profile-circled" />}
            {profile.job}
            |
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
    </article>
  );
}

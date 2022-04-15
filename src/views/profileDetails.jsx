import { insane, marked, oak } from "../deps.js";
import * as store from "../store.js";
import { Icon } from "../components/Icon.jsx";

export const router = new oak.Router()
  .get("/profiles/:id", profileDetails);

export async function profileDetails(ctx) {
  const profile = await store.profiles.findBy("pid", ctx.params.id);

  if (!profile) ctx.throw(404);

  await ctx.render(
    <article>
      <header>
        <h3>{profile.name}</h3>
        <img class="profile-avatar" src={profile.avatar} />
        <p>
          {profile.job && <Icon name="profile-circled" />}
          {profile.job}
        </p>
        <p>
          {profile.city && <Icon name="city" />}
          {profile.city}
        </p>
        <p>
          {profile.email}
        </p>
      </header>
      <section
        dangerouslySetInnerHTML={{
          __html: insane(marked.parse(profile.bio ?? "")),
        }}
      />
    </article>,
  );
}

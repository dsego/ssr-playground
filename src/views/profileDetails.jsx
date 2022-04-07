import { insane, marked, oak } from "../deps.js";
import * as store from "../store.js";
import { jobColor } from "../helpers.js";
import { Badge } from "../components/Badge.jsx";

export const router = new oak.Router()
  .get('/profiles/:id', profileDetails);

export async function profileDetails(ctx) {
  const profile = await store.profiles.findBy("pid", ctx.params.id);

  if (!profile) ctx.throw(404);

  await ctx.render(
    <>
      <nav>
        <a href="/profiles">Profile List</a>
        <img src="/assets/nav-arrow-right.svg" />
        <span>Profile</span>
      </nav>
      <article>
        <header>
          <h3>{profile.name}</h3>
          <img src={profile.avatar} />
          <p>
            {profile.job}
          </p>
        </header>
        <section
          dangerouslySetInnerHTML={{
            __html: insane(marked.parse(profile.bio ?? "")),
          }}
        />
      </article>
    </>,
  );
}

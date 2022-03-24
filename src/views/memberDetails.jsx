import { oak } from "../deps.js";
import { RoutePaths } from "../routePaths.js";
import * as store from "../store.js";

export const router = new oak.Router()
  .get(RoutePaths.MEMBER.VIEW, memberDetails);

export async function memberDetails(ctx) {
  const member = await store.members.findBy("pid", ctx.params.id);

  if (!member) ctx.throw(404);

  await ctx.render(
    <>
      <nav>
        <a href={RoutePaths.MEMBER.LIST}>◀ Back</a>
      </nav>
      <article>
        <header>
          <h3>{member.name}</h3>
          <img src={member.avatar} />
          <p>{member.job}</p>
        </header>
        <section>
          {member.bio}
        </section>
      </article>
    </>,
  );
}

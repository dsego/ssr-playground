import { oak } from "../deps.js";
import { RoutePaths } from "../routePaths.js"
import { MemberCard } from "../components/MemberCard.jsx";
import { LoadingIndicator } from "../components/LoadingIndicator.jsx";
import * as store from "../store.js";

export const router = new oak.Router()
  .get(RoutePaths.MEMBER.LIST, memberList)

export async function memberList(ctx) {
  const query = oak.helpers.getQuery(ctx);
  let members

  if (query.search) {
    members = await store.members.search(query.search);
  } else {
    members = await store.members.list();
  }

  // for HTMX requests render the bare result list fragment
  if (ctx.request.headers.has("HX-Request")) {
    await ctx.render(
      <>
        {!members.length && <i>no results</i>}
        {members.map((member) => <MemberCard member={member} />)}
      </>
    , {partial: true});
    return;
  }

  await ctx.render(
    <>
      <input
        type="search"
        name="search"
        placeholder="Search..."
        hx-get=""
        hx-trigger="keyup changed delay:200ms, search"
        hx-target="#member-list"
        hx-include="[name='layout']"
        // hx-push-url="true"
        hx-indicator="#loading-indicator"
      />
      <LoadingIndicator id="loading-indicator" />

      <toggle-buttons>
        <input
          id="layout-grid"
          name="layout"
          type="radio"
          value="grid"
          onChange="document.getElementById('member-list').setAttribute('data-layout', this.value);"
          checked
        />
        <label for="layout-grid" aria-la>
          <img height="20" src="/assets/source_icons_view-grid.svg" />
        </label>
        <input
          id="layout-table"
          name="layout"
          type="radio"
          value="table"
          onChange="document.getElementById('member-list').setAttribute('data-layout', this.value);"
        />
        <label for="layout-table">
          <img height="20" src="/assets/source_icons_list.svg" />
        </label>
      </toggle-buttons>

      <div id="member-list" data-layout="grid">
        {!members.length && <i>no results</i>}
        {members.map((member) => <MemberCard member={member} />)}
      </div>

      <a href={RoutePaths.MEMBER.EDIT.replace(":id", "new")}>
        <button>+ Add</button>
      </a>
    </>
  );
}

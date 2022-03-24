import { oak } from "../deps.js";
import { RoutePaths } from "../routePaths.js";
import { MemberCard } from "../components/MemberCard.jsx";
import { LoadingIndicator } from "../components/LoadingIndicator.jsx";
import * as store from "../store.js";

export const router = new oak.Router()
  .get(RoutePaths.MEMBER.LIST, memberList);

const pageSize = 8;

function PaginatedList({
  members,
  offset,
  pageSize,
  total,
  search,
}) {
  const prev = Math.max(0, offset - pageSize);
  const next = Math.min(total, offset + pageSize);
  return (
    <>
      <member-list>
        {!members.length && <i>no results</i>}
        {members.map((member) => <MemberCard member={member} />)}
      </member-list>
      <div>
        <button
          disabled={offset === 0}
          hx-get={`?offset=${prev}&search=${search}`}
          hx-target="#member-list"
        >
          ◀ Prev
        </button>
        <small>Showing {offset}-{next} of {total}</small>
        <button
          disabled={next >= total}
          hx-get={`?offset=${next}&search=${search}`}
          hx-target="#member-list"
        >
          Next ▶
        </button>
      </div>
    </>
  );
}

export async function memberList(ctx) {
  const query = oak.helpers.getQuery(ctx);
  const offset = Number(query.offset ?? 0);
  let members;
  let total;
  const search = query.search ?? "";

  const options = {
    orderAsc: "name",
    limit: pageSize,
    offset,
  };

  if (search) {
    [members, total] = await store.members.search(search, options);
  } else {
    members = await store.members.list(options);
    total = await store.members.count();
  }

  // for HTMX requests render the bare result list fragment
  if (ctx.request.headers.has("HX-Request")) {
    await ctx.render(
      <PaginatedList
        members={members}
        offset={offset}
        pageSize={pageSize}
        total={total}
        search={search}
      />,
      { partial: true },
    );
    return;
  }

  await ctx.render(
    <>
      <div>
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

        <a href={RoutePaths.MEMBER.EDIT.replace(":id", "new")}>
          <button>+ Add</button>
        </a>

        <pre>// TODO filter by job type</pre>
      </div>

      <div id="member-list" data-layout="grid">
        <PaginatedList
          members={members}
          offset={offset}
          pageSize={pageSize}
          total={total}
          search={search}
        />
      </div>
    </>,
  );
}

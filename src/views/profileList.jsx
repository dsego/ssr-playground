import { oak } from "../deps.js";
import { RoutePaths } from "../routePaths.js";
import { ProfileCard } from "../components/ProfileCard.jsx";
import { LoadingIndicator } from "../components/LoadingIndicator.jsx";
import * as store from "../store.js";

export const router = new oak.Router()
  .get(RoutePaths.PROFILE.LIST, profileList);

const pageSize = 8;

function PaginatedList({
  profiles,
  offset,
  pageSize,
  total,
  search,
}) {
  const prev = Math.max(0, offset - pageSize);
  const next = Math.min(total, offset + pageSize);
  return (
    <>
      <profile-list>
        {!profiles.length && <i>no results</i>}
        {profiles.map((profile) => <ProfileCard profile={profile} />)}
      </profile-list>
      <pagination-controls>
        <button
          disabled={offset === 0}
          hx-get={`?offset=${prev}&search=${search}`}
          hx-target="#profile-list"
        >
          ◀ Prev
        </button>
        <small>Showing {offset}-{next} of {total}</small>
        <button
          disabled={next >= total}
          hx-get={`?offset=${next}&search=${search}`}
          hx-target="#profile-list"
        >
          Next ▶
        </button>
      </pagination-controls>
    </>
  );
}

export async function profileList(ctx) {
  const query = oak.helpers.getQuery(ctx);
  const offset = Number(query.offset ?? 0);
  let profiles;
  let total;
  const search = query.search ?? "";

  const options = {
    orderAsc: "name",
    limit: pageSize,
    offset,
  };

  if (search) {
    [profiles, total] = await store.profiles.search(search, options);
  } else {
    profiles = await store.profiles.list(options);
    total = await store.profiles.count();
  }

  // for HTMX requests render the bare result list fragment
  if (ctx.request.headers.has("HX-Request")) {
    // Deno.sleepSync(500)
    await ctx.render(
      <PaginatedList
        profiles={profiles}
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
          hx-target="#profile-list"
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
            onChange="document.getElementById('profile-list').setAttribute('data-layout', this.value);"
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
            onChange="document.getElementById('profile-list').setAttribute('data-layout', this.value);"
          />
          <label for="layout-table">
            <img height="20" src="/assets/source_icons_list.svg" />
          </label>
        </toggle-buttons>

        <a href={RoutePaths.PROFILE.EDIT.replace(":id", "new")}>
          <button>+ Add</button>
        </a>

        <pre>// TODO filter by job type</pre>
      </div>

      <div id="profile-list" data-layout="grid">
        <PaginatedList
          profiles={profiles}
          offset={offset}
          pageSize={pageSize}
          total={total}
          search={search}
        />
      </div>
    </>,
  );
}

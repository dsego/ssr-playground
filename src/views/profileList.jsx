import { oak } from "../deps.js";
import { RoutePaths } from "../routePaths.js";
import { ProfileCard } from "../components/ProfileCard.jsx";
import { LoadingIndicator } from "../components/LoadingIndicator.jsx";
import { Icon } from "../components/Icon.jsx";
import * as store from "../store.js";

export const router = new oak.Router()
  .get(RoutePaths.PROFILE.LIST, profileList);

const pageSize = 8;

async function PaginatedList({
  profiles,
  offset,
  pageSize,
  total,
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
          hx-get={`?offset=${prev}`}
          hx-target="#profile-list"
          hx-include="[data-filter]"
        >
          <Icon name="nav-arrow-left" /> Prev
        </button>
        <small>Showing {offset}-{next} of {total}</small>
        <button
          disabled={next >= total}
          hx-get={`?offset=${next}`}
          hx-target="#profile-list"
          hx-include="[data-filter]"
        >
          Next <Icon name="nav-arrow-right" />
        </button>
      </pagination-controls>
    </>
  );
}

export async function profileList(ctx) {
  const query = oak.helpers.getQuery(ctx);
  const offset = Number(query.offset ?? 0);
  const search = query.search ?? "";
  const jobs = await store.profiles.jobs();

  const options = {
    orderAsc: "name",
    limit: pageSize,
    offset,
    filter: {
      job: query.job,
    },
    search,
  };

  const [profiles, total] = await store.profiles.list(options);

  // for HTMX requests render the bare result list fragment
  if (ctx.request.headers.has("HX-Request")) {
    await ctx.render(
      <PaginatedList
        profiles={profiles}
        offset={offset}
        pageSize={pageSize}
        total={total}
      />,
      { partial: true },
    );
    return;
  }

  await ctx.render(
    <>
      <div id="profile-container">
        <input
          type="search"
          name="search"
          placeholder="Search..."
          hx-get=""
          hx-trigger="keyup changed delay:200ms, search"
          hx-target="#profile-list"
          hx-include="[data-filter]"
          hx-indicator="#loading-indicator"
          data-filter
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
            <Icon size="20" name="view-grid" />
          </label>
          <input
            id="layout-table"
            name="layout"
            type="radio"
            value="table"
            onChange="document.getElementById('profile-list').setAttribute('data-layout', this.value);"
          />
          <label for="layout-table">
            <Icon size="20" name="list" />
          </label>
        </toggle-buttons>

        <select
          name="job"
          hx-get=""
          hx-include="[data-filter]"
          hx-target="#profile-list"
          hx-indicator="#loading-indicator"
          data-filter
        >
          <option value="">All positions</option>
          {jobs.map((job) => <option value={job} selected={job === query.job}>{job}</option>)}
        </select>

        <a href={RoutePaths.PROFILE.EDIT.replace(":id", "new")}>
          <button><Icon name="plus" /> Add</button>
        </a>
      </div>

      <div id="profile-list" data-layout="grid">
        <PaginatedList
          profiles={profiles}
          offset={offset}
          pageSize={pageSize}
          total={total}
        />
      </div>
    </>,
  );
}

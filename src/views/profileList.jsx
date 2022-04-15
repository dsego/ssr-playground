import { oak } from "../deps.js";
import { ProfileCard } from "../components/ProfileCard.jsx";
import { ProfileRow } from "../components/ProfileRow.jsx";
import { LoadingIndicator } from "../components/LoadingIndicator.jsx";
import { Icon } from "../components/Icon.jsx";
import * as store from "../store.js";

export const router = new oak.Router()
  .use("/profiles/listonly", (ctx, next) => {
    ctx.listOnly = true;
    return next();
  })
  .get("/profiles/listonly", profileList)
  .get("/profiles", profileList);

const pageSize = 8;

async function PaginatedList({
  layout = "grid",
  profiles,
  offset,
  pageSize,
  total,
}) {
  const prev = Math.max(0, offset - pageSize);
  const next = Math.min(total, offset + pageSize);

  return (
    <>
      <profile-list data-layout={layout}>
        {!profiles.length && <i>no results</i>}
        {layout === "grid" &&
          (profiles.map((profile) => <ProfileCard profile={profile} />))}
        {layout === "table" &&
          (profiles.map((profile) => <ProfileRow profile={profile} />))}
      </profile-list>
      <pagination-controls>
        <input
          type="hidden"
          name="offset"
          value={offset}
          data-offset
        />
        <button
          type="button"
          name="offset"
          disabled={offset === 0}
          hx-get={`/profiles/listonly?offset=${prev}`}
          hx-target="#profile-list"
          hx-include="[data-filter]"
        >
          <Icon name="nav-arrow-left" /> Prev
        </button>
        <small>Showing {offset}-{next} of {total}</small>
        <button
          type="button"
          name="offset"
          disabled={next >= total}
          hx-get={`/profiles/listonly?offset=${next}`}
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
    orderDesc: "created_at",
    limit: pageSize,
    offset,
    filter: {
      job: query.job,
    },
    search,
  };

  const [profiles, total] = await store.profiles.list(options);

  if (ctx.listOnly) {
    await ctx.render(
      <PaginatedList
        layout={query.layout}
        profiles={profiles}
        offset={offset}
        pageSize={pageSize}
        total={total}
      />,
    );
    return;
  }

  await ctx.render(
    <>
      <div id="profile-filters">
        <input
          type="search"
          name="search"
          placeholder="Search..."
          value={search}
          hx-get="/profiles/listonly"
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
            hx-get="/profiles/listonly"
            hx-target="#profile-list"
            hx-include="[data-filter], [data-offset]"
            data-filter
            checked={query.layout !== "table"}
          />
          <label for="layout-grid" aria-la>
            <Icon size="20" name="view-grid" />
          </label>
          <input
            id="layout-table"
            name="layout"
            type="radio"
            value="table"
            hx-get="/profiles/listonly"
            hx-target="#profile-list"
            hx-include="[data-filter], [data-offset]"
            data-filter
            checked={query.layout === "table"}
          />
          <label for="layout-table">
            <Icon size="20" name="list" />
          </label>
        </toggle-buttons>

        <select
          name="job"
          hx-get="/profiles/listonly"
          hx-include="[data-filter]"
          hx-target="#profile-list"
          hx-indicator="#loading-indicator"
          data-filter
        >
          <option value="">All positions</option>
          {jobs.map((job) => (
            <option value={job} selected={job === query.job}>{job}</option>
          ))}
        </select>

        <button
          hx-target="body"
          hx-swap="beforeend"
          hx-get={`/profiles/edit/new`}
        >
          <Icon name="edit" /> Add
        </button>
      </div>

      <div id="profile-list">
        <PaginatedList
          layout={query.layout}
          profiles={profiles}
          offset={offset}
          pageSize={pageSize}
          total={total}
        />
      </div>
    </>,
  );
}

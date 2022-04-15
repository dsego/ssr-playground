import { oak } from "../deps.js";
import { ProfileList } from "../components/ProfileList.jsx";
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
      <ProfileList
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
        <ProfileList
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

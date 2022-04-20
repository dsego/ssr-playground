import { Icon } from "../partials/Icon.jsx";
import { ProfileCard } from "../partials/ProfileCard.jsx";
import { ProfileRow } from "../partials/ProfileRow.jsx";

export async function ProfileList({
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

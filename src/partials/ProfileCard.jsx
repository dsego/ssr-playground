import { Avatar } from "./Avatar.jsx";
import { Identicon } from "./Identicon.jsx";
import { Icon } from "./Icon.jsx";

export async function ProfileCard({ profile }) {
  return (
    <profile-card class="card-w-shadow">
      <profile-card-header>
        {profile.avatar
          ? <Avatar url={profile.avatar} />
          : <Identicon token={profile.email ?? ""} />}
      </profile-card-header>
      <h3>{profile.name}</h3>
      <p>
        <small>{profile.email}</small>
      </p>
      {profile.job && (
        <p class="muted">
          <Icon name="profile-circled" /> <small>{profile.job}</small>
        </p>
      )}
      {profile.city && (
        <p class="muted">
          <Icon name="city" />
          <small>{profile.city}</small>
        </p>
      )}
      <profile-card-footer>
        <a
          class="mx-xs"
          hx-target="body"
          hx-swap="beforeend"
          href={`/profiles/edit/${profile.pid}`}
          hx-get={`/profiles/edit/${profile.pid}`}
        >
          Edit
        </a>
        <a target="_blank" href={`/profiles/${profile.pid}`} class="mx-xs">
          View
          <Icon name="open-in-window" />
        </a>
      </profile-card-footer>
    </profile-card>
  );
}

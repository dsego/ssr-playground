import { Avatar } from "./Avatar.jsx";
import { Identicon } from "./Identicon.jsx";
import { Icon } from "./Icon.jsx";

export async function ProfileCard({ profile }) {
  return (
    <profile-card class="card-w-shadow">
      <header>
        {profile.avatar
          ? <Avatar url={profile.avatar} />
          : <Identicon token={profile.email ?? ""} />}
      </header>
      <p>{profile.name}</p>
      <p>{profile.email}</p>
      {profile.job && (
        <p class="muted">
          <Icon name="profile-circled" /> {profile.job}
        </p>
      )}
      {profile.city && (
        <p class="muted">
          <Icon name="city" />{profile.city}
        </p>
      )}
      <p class="text-center">
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
      </p>
    </profile-card>
  );
}

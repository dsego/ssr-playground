import { Avatar } from "./Avatar.jsx";
import { Identicon } from "./Identicon.jsx";
import { Icon } from "./Icon.jsx";

export async function ProfileRow({ profile }) {
  return (
    <profile-row>
      <header>
        {profile.avatar
          ? <Avatar url={profile.avatar} />
          : <Identicon token={profile.email ?? ""} />}
      </header>
      <p>{profile.name}</p>
      <p>
        {profile.job && <Icon name="profile-circled" />}
        {profile.job}
      </p>
      <p>
        {profile.city && <Icon name="city" />}
        {profile.city}
      </p>
      <p>
        {profile.email}
      </p>
      <p>
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
    </profile-row>
  );
}

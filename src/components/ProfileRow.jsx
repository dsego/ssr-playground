import { RoutePaths } from "../routePaths.js";
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
        <Icon name="profile-circled" />
        {profile.job}
      </p>
      <p>
        <Icon name="city" />
        {profile.city}
      </p>
      <p>
        {profile.email}
      </p>
      <p>
        <a href={RoutePaths.PROFILE.VIEW.replace(":id", profile.pid)}>View</a>
        <a href={RoutePaths.PROFILE.EDIT.replace(":id", profile.pid)}>Edit</a>
      </p>
    </profile-row>
  );
}

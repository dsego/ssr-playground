import { RoutePaths } from "../routePaths.js";
import { Avatar } from "./Avatar.jsx";
import { Identicon } from "./Identicon.jsx";

export function MemberCard({ member }) {
  return (
    <member-card>
      <p>{member.name}</p>
      <p>
        <small>{member.email}</small>
      </p>
      {member.avatar
        ? <Avatar url={member.avatar} />
        : <Identicon token={member.email ?? ""} />
      }
      <p>
        <a href={RoutePaths.MEMBER.VIEW.replace(":id", member.pid)}>View</a>
        <a href={RoutePaths.MEMBER.EDIT.replace(":id", member.pid)}>Edit</a>
      </p>
    </member-card>
  );
}

import { identicon } from "../deps.js";

export function Identicon({ token }) {
  return (
    <identicon-svg dangerouslySetInnerHTML={{ __html: identicon(token) }} />
  );
}

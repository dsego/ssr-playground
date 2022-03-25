import { identicon } from "../deps.js";

export function Identicon({ token }) {
  return (
    <div
      class="identicon"
      dangerouslySetInnerHTML={{ __html: identicon(token) }}
    />
  );
}

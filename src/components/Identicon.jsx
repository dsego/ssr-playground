import { identicon } from "../deps.js";

export function Identicon({ token, size = 80 }) {
  return (
    <div
      class="identicon"
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: identicon(token) }}
    />
  );
}

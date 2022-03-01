import { identicon } from "../deps.js";
// <flex horizontal />  or <hbox />
// <flex vertical />    or <vbox />

// <grid>

// export function Button() {

// }

// export function Button({
//   confirmText,
//   confirmButtonLabel,
//   cancelButtonLabel,
// }) {

// }

export function Identicon({ username, size = 80 }) {
  return (
    <div
      class="identicon"
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: identicon(username) }}
    />
  );
}

export function Avatar({ url, size = 80 }) {
  return <img class="avatar" src={url} style={{ width: size, height: size }} />;
}

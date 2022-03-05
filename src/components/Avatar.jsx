export function Avatar({ url, size = 80 }) {
  return (
    <img
      class="avatar"
      src={url}
      style={{ width: size, height: size }}
    />
  );
}

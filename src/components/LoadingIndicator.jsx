export function LoadingIndicator({ id, class: className, size = 20 }) {
  return (
    <loading-indicator class={className ?? ""} id={id}>
      <loading-indicator-animation />
    </loading-indicator>
  );
}

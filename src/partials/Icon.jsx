// TODO: update cache when file changes
const cached = {};

// TODO: working size parameter
export async function Icon({ name, size = 16, class: className, ...rest }) {
  if (!cached[name]) {
    cached[name] = await Deno.readTextFile(
      `${Deno.cwd()}/assets/icons/${name}.svg`,
    );
  }
  let svg = cached[name];
  if (size) {
    svg = svg.replace('width="24"', `width=${size}`)
      .replace('height="24"', `height=${size}`);
  }

  return (
    <my-icon
      dangerouslySetInnerHTML={{ __html: svg }}
      class={className}
      {...rest}
    />
  );
}

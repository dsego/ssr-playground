const cached = {};

export async function Icon({ name, size = 16 }) {
  if (!cached[name]) {
    cached[name] = await Deno.readTextFile(
      `${Deno.cwd()}/assets/icons/${name}.svg`,
    );
  }
  const svg = cached[name];
  // .replace('width="24"', `width=${size}`).replace('height="24"', `height=${size}`)

  return <span class="icon" dangerouslySetInnerHTML={{ __html: svg }} />;
}

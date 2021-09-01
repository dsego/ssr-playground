
// Returns a lookup table of file paths in the directory 

// promise.all ?
export async function fileLookup(rootDir) {
  const paths = {}
  const stack = []
  stack.push(rootDir)

  while (stack.length > 0) {
    const dir = stack.pop();
    for await (const entry of Deno.readDir(dir)) {
      if (entry.isFile) {
        const filepath = `${dir}/${entry.name}`;
        paths[filepath] = true
      } else if (entry.isDirectory) {
        stack.push(`${dir}/${entry.name}`)
      }
      // we are not handling symlinks
    }
  }
  return paths
}

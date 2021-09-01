import { pascalCase } from "../deps.js";

// Resolve URL path to page
//  - allows js file name or kebab-case (eg FooPage.js & foo-page)
//  - supports Index.js in root dir but not sub-directories (examples in test file)
export function resolve(pathname) {
  if (pathname === undefined) {
    return "Index.eta";
  }

  const regex = /\/?(.*(?=\/))?\/?(.*)/;
  let [fullMatch, path, filename] = pathname.match(regex);

  if (filename) {
    const ext = filename.substr(-4);
    if (ext !== ".eta") {
      filename = pascalCase(filename) + ".eta";
    }
  } else {
    return "Index.eta";
  }

  if (path) {
    return `${path}/${filename}`;
  }
  return filename;
}

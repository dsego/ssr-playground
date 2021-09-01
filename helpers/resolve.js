import { pascalCase } from "../deps.js";


const INDEX = "Index.jsx"

// Resolve URL path to page
//  - allows JSX file name or kebab-case (eg FooPage.jsx & foo-page)
//  - supports Index.jsx in root dir but not sub-directories (examples in test file)
export function resolve(pathname) {
  if (pathname === undefined) {
    return INDEX;
  }

  const regex = /\/?(.*(?=\/))?\/?(.*)/;
  let [fullMatch, path, filename] = pathname.match(regex);

  if (filename) {
    const ext = filename.substr(-4);
    if (ext !== ".jsx") {
      filename = pascalCase(filename) + ".jsx";
    }
  } else {
    return INDEX;
  }

  if (path) {
    return `${path}/${filename}`;
  }
  return filename;
}

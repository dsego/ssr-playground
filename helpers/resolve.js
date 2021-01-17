import { pascalCase } from "../deps.js";

// Resolve URL path to JSX page component path
//  - allows jsx file name or kebab-case (eg FooPage.jsx & foo-page)
//  - supports Index.jsx in root dir but not sub-directories (examples in test file)
export default function resolve(pathname) {
  if (pathname === undefined) {
    return "Index.jsx";
  }

  const regex = /\/?(.*(?=\/))?\/?(.*)/;
  let [fullMatch, path, filename] = pathname.match(regex);

  if (filename) {
    const ext = filename.substr(-4);
    if (ext !== ".jsx") {
      filename = pascalCase(filename) + ".jsx";
    }
  } else {
    return "Index.jsx";
  }

  if (path) {
    return `${path}/${filename}`;
  }
  return filename;
}

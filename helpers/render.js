// https://github.com/sindresorhus/escape-goat/blob/master/index.js
const htmlEscape = (string) =>
  string
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const htmlTree = [{
  type: "div",
  props: null,
  children: [
    {
      type: "div",
      props: null,
      children: [
        {
          type: "x-async",
          props: { "data-ms": 450 },
          children: [
            { type: "x-async", props: { "data-ms": 50 }, children: [] },
          ],
        },
        { type: "x-async", props: { "data-ms": 50 }, children: [] },
      ],
    },
    {
      type: "div",
      props: null,
      children: [
        {
          type: "x-async",
          props: { "data-ms": 333 },
          children: [
            { type: "x-async", props: { "data-ms": 300 }, children: [] },
            { type: "x-async", props: { "data-ms": 100 }, children: [] },
            { type: "x-async", props: { "data-ms": 300 }, children: [] },
            { type: "x-async", props: { "data-ms": 500 }, children: [] },
          ],
        },
      ],
    },
    {
      type: "div",
      props: null,
      children: [
        {
          type: "x-async",
          props: { "data-ms": 750 },
          children: [
            { type: "x-async", props: { "data-ms": 250 }, children: [] },
            { type: "x-async", props: { "data-ms": 150 }, children: [] },
          ],
        },
      ],
    },
  ],
}];

// const result = await Deno.transpileOnly({
//   "Hello.jsx": `
//     const Hello = async () =>
//       (<b>
//         Hello,
//         { world() }
//         { 123 }
//       </b>)
//   `,
//   "component.jsx": `
//     const a = <code><Hello /></code>
//   `,
//   "input.jsx": `
//     const a = <input value="123" />
//     const b = <input value={123} />
//   `,
//   "emptyTag.jsx": `
//     const a = <div id="id">  </div>
//   `,
//   "fragment.jsx": `
//     const a = <><b>Hello</b> <i>World</i></>
//   `,
//   "children.jsx": `
//     const a = (
//       <Parent>
//         <Child />
//         <Child />
//       </Parent>
//     )
//     const b = <a>{[ 1, 2, 3 ]}</a>
//   `
// }, {
//   jsxFactory: "html",
//   jsxFragmentFactory: "'fragment'"
// });

// console.log(Deno.inspect(result, { depth: 99 }))

// console.log(
//   html("b", null, "Hello!")
// )
// console.log(
//   html("h1", { class: "cls-foo" }, "Hello!")
// )
// console.log(
//   html("p", { id: "id-foo", class: "cls-foo" }, "Hello!")
// )
// console.log(
//   html("input", { id: "id-foo", class: "cls-foo" })
// )
// console.log(
//   html("div", null, " ")
// )
// console.log(
//   html("ul", null,
//     html("li", null, html("strong", null, "Hello")),
//     html("li", null, html("em", null, "World"))
//   )
// )
// console.log(
//   html("fragment", null,
//     html("strong", null, "Hello"),
//     html("em", null, "World")
//   )
// )
// console.log(
//   html(Sum, { x: 2, y: 2 })
// )

// console.log(
//   html("h1", null, html(AsyncElement, { delay: 10 }))
// )

function html(type, props, ...children) {
  if (children.length === 1 && Array.isArray(children[0])) {
    [children] = children;
  }
  return { type, props, children };
}

const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const Sum = ({ x, y }) => x + y;
const AsyncElement = async ({ ms, children }) => {
  await delay(ms);
  return html("x-async", { "data-ms": ms }, children);
};

const App = () => {
  const Hello = html("a", { href: "#" });
  return html("div", { class: "app" }, Hello);
};

const log = (val) =>
  console.log(Deno.inspect(val, { colors: true, depth: 99 }));

// log(await render(
//   html("b", null, "Hello!")
// ))

// log(await render(
//   html("h1", { class: "cls-foo" }, "Hello!")
// ))

// log(await render(
//   html("p", { id: "id-foo", class: "cls-foo" }, "Hello!")
// ))

// log(await render(
//   html("input", { id: "id-foo", class: "cls-foo" })
// ))

// log(await render(
//   html("div", null, " ")
// ))

// log(await render(
//   html("ul", null,
//     html("li", null, html("strong", null, "Hello")),
//     html("li", null, html("em", null, "World"))
//   )
// ))

// log(await render(
//   html("fragment", null,
//     html("strong", null, "Hello"),
//     html("em", null, "World")
//   )
// ))

// log(await render(
//   html("form", null,
//     html("fragment", null,
//       html("input", { placeholder: "Email" }),
//       html("button", null, "Click Me!")
//     )
//   )
// ))

// log(await render(
//   html(Sum, { x: 2, y: 2 })
// ))

// log(await render(
//   html("h1", null, html(AsyncElement, { ms: 1 }))
// ))

// log(await render(
//   html(App)
// ))

// log(await render(
//   html(AsyncElement, { ms: 1 })
// ))


export function renderProps(props) {
  return Object.keys(props).map((key) =>
    `${key}="${htmlEscape(String(props[key]))}"`
  ).join(" ");
}

function isEmpty(obj) {
  return !obj || Object.keys(obj).length === 0;
}

// export function renderLeaf(node) {console.log("LEAF", node)
//   if (!node.type) {
//     return node;
//   } else {
//     const propStr = isEmpty(node.props) ? "" : " "+renderProps(node.props);

//     if (emptyElements.includes(node.type)) {
//       return `<${node.type}${propStr} />`
//     } else {
//       const innerHTML = String(node.children);
//       return `<${node.type}${propStr}>${innerHTML}</${node.type}>`
//     }
//   }
// }




// TODO rewrite with stack
export function renderElements(nodes, indent = "") {
  const emptyElements = [
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
  ];
  let html = "";
  let count = 1;

  for (let [i, node] of nodes.entries()) {
    if (!node.type) {
      html += htmlEscape(String(node));
    } else {
      const propStr = isEmpty(node.props) ? "" : " " + renderProps(node.props);
      if (emptyElements.includes(node.type)) {
        html += `\n${indent}<${node.type}${propStr} />`;
      } else {
        let [innerHTML, subtreeCount] = renderElements(
          node.children,
          indent + "  ",
        );
        count += subtreeCount;
        if (subtreeCount > 1) {
          innerHTML += `\n${indent}`;
        }
        html +=
          `\n${indent}<${node.type}${propStr}>${innerHTML}</${node.type}>`;
      }
    }
  }
  return [html, count];
}

// const [str, c] = renderElements(htmlTree);
// console.log(str);

// TODO rewrite with stack
export async function resolve(nodes) {
  let promises = [];

  // resolve all children first
  nodes.forEach((node, i) => {
    const p = resolve(nodes[i].children);
    p.then((val) => nodes[i].children = val);
    promises.push(p);
  });

  await Promise.all(promises);

  promises = [];

  // resolve function calls
  nodes.forEach((node, i) => {
    if (typeof nodes[i].type === "function") {
      const params = { ...nodes[i].props, children: nodes[i].children };
      const p = Promise.resolve(nodes[i].type(params));
      p.then((val) => nodes[i] = val);
      promises.push(p);
    }
  });

  await Promise.all(promises);

  return nodes;
}

export async function render(root) {
  const nodes = await resolve([root]);
  const [str, count] = renderElements(nodes)
  return str;
}


// total time should be ~200ms
console.time("total");
console.log(await render(
  html("div", null,
    html("div", null,
      html(AsyncElement, { ms: 50 },
        html(AsyncElement, { ms: 70 })
      ),
      html(AsyncElement, { ms: 30 })
    ),
    html("div", null,
      html(AsyncElement, { ms: 100 },
        html(AsyncElement, { ms: 30 }),
        html(AsyncElement, { ms: 10 }),
        html(AsyncElement, { ms: 30 }),
        html(AsyncElement, { ms: 50 })
      ),
    ),
    html("div", null,
      html(AsyncElement, { ms: 80 },
        html(AsyncElement, { ms: 50 }),
        html(AsyncElement, { ms: 120 }),
      )
    ),
  )
))
console.timeEnd("total");

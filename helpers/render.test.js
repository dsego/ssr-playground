import { assertEquals } from "https://deno.land/std@0.83.0/testing/asserts.ts";
import { renderLeaf } from "./render.js";

Deno.test("an element with id & class", () => {
  assertEquals(
    renderLeaf({
      type: "h1",
      props: { id: "foo", class: "bar" },
      children: [],
    }),
    `<h1 id="foo" class="bar"></h1>`,
  );
});

Deno.test("an element with text inside", () => {
  assertEquals(
    renderLeaf({
      type: "p",
      props: {},
      children: [" This is a paragraph... "],
    }),
    `<p> This is a paragraph... </p>`,
  );
});

Deno.test("text", () => {
  assertEquals(renderLeaf("Hello World"), "Hello World");
});

Deno.test("void element", () => {
  assertEquals(
    renderLeaf({
      type: "img",
      props: { src: "/dir1/image.png" },
      children: [],
    }),
    `<img src="/dir1/image.png" />`,
  );
});

Deno.test("escape strings", () => {
  assertEquals(
    renderLeaf({
      type: "div",
      props: { title: "<|title|>" },
      children: [` "Hugz & kisses ☺" -> for 'YOU' `],
    }),
    `<div title="&lt;|title|&gt;"> &quot;Hugz &amp; kisses ☺&quot; -&gt; for &#39;YOU&#39; </div>`,
  );
});

// TODO escaping entities etc

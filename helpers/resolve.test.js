import { assertEquals } from "https://deno.land/std@0.83.0/testing/asserts.ts";
import resolve from "./resolve.js";

Deno.test("undefined -> Index.jsx", () => {
  assertEquals(resolve(undefined), "Index.jsx");
});
Deno.test("empty -> Index.jsx", () => {
  assertEquals(resolve(""), "Index.jsx");
});
Deno.test("/ -> Index.jsx", () => {
  assertEquals(resolve("/"), "Index.jsx");
});
Deno.test("About.jsx -> About.jsx", () => {
  assertEquals(resolve("About.jsx"), "About.jsx");
});
Deno.test("/about -> About.jsx", () => {
  assertEquals(resolve("/about"), "About.jsx");
});
Deno.test("/foo/List.jsx -> foo/List.jsx", () => {
  assertEquals(resolve("/foo/List.jsx"), "foo/List.jsx");
});
Deno.test("/foo/list -> foo/List.jsx", () => {
  assertEquals(resolve("/foo/list"), "foo/List.jsx");
});

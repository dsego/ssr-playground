import { assertEquals } from "https://deno.land/std@0.83.0/testing/asserts.ts";
import { resolve } from "./resolve.js";

Deno.test("undefined -> Index.js", () => {
  assertEquals(resolve(undefined), "Index.js");
});

Deno.test("empty -> Index.js", () => {
  assertEquals(resolve(""), "Index.js");
});

Deno.test("/ -> Index.js", () => {
  assertEquals(resolve("/"), "Index.js");
});

Deno.test("About.js -> About.js", () => {
  assertEquals(resolve("About.js"), "About.js");
});

Deno.test("/about -> About.js", () => {
  assertEquals(resolve("/about"), "About.js");
});

Deno.test("/foo/List.js -> foo/List.js", () => {
  assertEquals(resolve("/foo/List.js"), "foo/List.js");
});

Deno.test("/foo/list -> foo/List.js", () => {
  assertEquals(resolve("/foo/list"), "foo/List.js");
});

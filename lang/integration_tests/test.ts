import { assertEquals } from "jsr:@std/assert";
import { StewLang } from "../mod.ts";
import type { Recipe } from "../parser/recipe.ts";

const lang = new StewLang();

Deno.test("sample", () => {
  const expected: Recipe = {
    ingredients: [{  name: ["sample"],}],
    meta: {},
  }
  assertEquals(lang.read("sample"), expected);
});

Deno.test("recipe multiline", () => {
  const sut = `foo 
bar
`;

  const expected: Recipe = {
      ingredients: [{  name: ["foo"],  }, {
        name: ["bar"],
      }],
      meta: {},
  }
  assertEquals(
    lang.read(sut),
    expected,
  );
});

import { assertEquals } from "jsr:@std/assert";
import { Recipe, StewLang } from "../mod.ts";
import { Ingredient } from "../parser/ingredient.ts";

const lang = new StewLang();

Deno.test("sample", () => {
  assertEquals(lang.read("sample"), new Recipe([new Ingredient(["sample"])]));
});

Deno.test("recipe multiline", () => {
  const sut = `foo 
bar
`;
  assertEquals(
    lang.read(sut),
    new Recipe([new Ingredient(["foo"]), new Ingredient(["bar"])]),
  );
});

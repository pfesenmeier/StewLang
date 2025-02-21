import { assertEquals } from "jsr:@std/assert/equals";
import { Ingredient } from "../parser/ingredient.ts";

Deno.test("id is name if top level", () => {
  const sut = new Ingredient(["salad"]);

  assertEquals(sut.id, "salad");
});
Deno.test("id has parent ids if nested", () => {
  const parent = new Ingredient(["evening", "dinner"]);
  const sut = new Ingredient(["salad"], { parent });

  assertEquals(sut.id, "evening-dinner:salad");
});

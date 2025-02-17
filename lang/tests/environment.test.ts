import { assertEquals } from "jsr:@std/assert/equals";
import { Environment } from "../parser/environment.ts";
import { Ingredient } from "../parser/ingredient.ts";

Deno.test("resolves top-level ingredients", () => {
    const env = new Environment()
    env.define(new Ingredient(["butter"]))
    const result = env.getId("butter")
    assertEquals(result, "butter")
});

Deno.test("resolves when referencing outer variable", () => {
    let env = new Environment()
    env.define(new Ingredient(["butter"]))
    env = new Environment("dough", env)
    const result = env.getId("butter")
    assertEquals(result, "butter")
})

Deno.test("vars disappear when exit an ingredient", () => {
    const outer = new Environment()
    const inner = new Environment("dough", outer)
    inner.define(new Ingredient(["butter"]))
    const result = inner.getId("butter")
    assertEquals(result, "dough:butter")
    assertEquals(outer.getId("butter"), undefined)
})

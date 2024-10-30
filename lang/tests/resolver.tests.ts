// all that's left to do after a recipe is constructed is to resolve the variable references. -> point the @foo's to the foo.
// this "point" will be represented by... Environment<string, object>
// environment will be built up with ingredient declarations...
// since currently no way for ingredient to know about its parents
//
// this will allow at runtime for any interpreter to... lookup an ingredient
//
// for href's to work... ingredients will need unique identifier
// could generate one, or be based on location...
// maybe shove it into Environment class

import { assertEquals } from "jsr:@std/assert/equals";
import { Identifier } from "../parser/identifier.ts";
import { Ingredient } from "../parser/ingredient.ts";
import { Recipe } from "../parser/recipe.ts";
import { Step } from "../parser/step.ts";
import { Resolver } from "../resolver/resolver.ts";

// in react app, could generate a link to id of the ingredient
Deno.test("it resolves sibling references at top level", () => {
    const input = new Recipe([
        new Ingredient(["a"]),
        new Ingredient(["b"], {
            detail: [
                new Step(["mix", new Identifier("@a"), "thoroughly"]),
            ],
        }),
    ]);

    new Resolver(input).resolve();

    const step = input.ingredients.at(1)!.detail!.at(0)! as Step;
    const identifier = step.text.at(1) as Identifier;

    assertEquals(
        identifier.ingredientId,
        "a",
    );
});

Deno.test("it resolves sibling references inside ingredient", () => {
    const parent = new Ingredient(["a"], {
        detail: [
            new Step(["mix", new Identifier("@b")]),
        ],
    });
    parent.detail?.push(new Ingredient(["b"], { parent }));
    const input = new Recipe([parent]);

    new Resolver(input).resolve();

    const step = input.ingredients.at(0)!.detail!.at(0)! as Step;
    const identifier = step.text.at(1) as Identifier;

    assertEquals(
        identifier.ingredientId,
        "a:b",
    );
});

// multi-word ingredients

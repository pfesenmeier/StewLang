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
import type { Identifier } from "../parser/identifier.ts";
import type { Ingredient } from "../parser/ingredient.ts";
import { Resolver } from "../resolver/resolver.ts";

// in react app, could generate a link to id of the ingredient
Deno.test("it resolves sibling references at top level", () => {
  const aIngredient: Ingredient = { name: ["a"] };
  const input = {
    ingredients: [
      aIngredient,
      {
        name: ["b"],
        steps: [
          { text: ["mix", { name: "@a" }] },
        ],
      },
      {
        name: ["b"],
        steps: [
          { text: ["mix", { name: "@a" }, "thoroughly"] },
        ],
      },
    ],
  };

  new Resolver(input).resolve();

  const step = input.ingredients.at(1)!.steps!.at(0)!;
  const identifier = step.text.at(1) as Identifier;

  assertEquals(
    identifier.ingredient,
    aIngredient,
  );
});

Deno.test("it resolves sibling references inside ingredient", () => {
  const siblingIngredient: Ingredient = { name: ["b"] };
  const parent: Ingredient = {
    name: ["a"],
    steps: [
      { text: ["mix", { name: "@b" }] },
    ],
    ingredients: [siblingIngredient],
  };
  siblingIngredient.parent = parent;
  const input = { ingredients: [parent] };

  new Resolver(input).resolve();

  const step = input.ingredients.at(0)!.steps!.at(0)!;
  const identifier = step.text.at(1) as Identifier;

  assertEquals(
    identifier.ingredient,
    siblingIngredient,
  );
});

Deno.test("it resolves sibling references inside ingredient with multiple words", () => {
  const childIngredient: Ingredient = { name: ["b", "c"] };
  const parent: Ingredient = {
    name: ["a"],
    steps: [
      { text: ["mix", { name: "@b-c" }] },
    ],
    ingredients: [childIngredient],
  };
  childIngredient.parent = parent;
  const input = { ingredients: [parent] };

  new Resolver(input).resolve();

  const step = input.ingredients.at(0)!.steps!.at(0)!;
  const identifier = step.text.at(1) as Identifier;

  assertEquals(
    identifier.ingredient,
    childIngredient,
  );
});

Deno.test("it resolves sibling references inside ingredient", () => {
  const siblingIngredient: Ingredient = { name: ["b"] };
  const input = {
    ingredients: [
      {
        name: ["a"],
        ingredients: [
          siblingIngredient,
          {
            name: ["c"],
            steps: [
              { text: [{ name: "@b" }] },
            ],
          },
        ],
      },
    ],
  };

  new Resolver(input).resolve();

  const ingredient = input.ingredients.at(0)!.ingredients!.at(1)!;
  const step = ingredient.steps?.at(0)!;
  const identifier = step.text.at(0) as Identifier;

  assertEquals(
    identifier.ingredient,
    siblingIngredient,
  );
});

Deno.test("it resolves sibling references when referent comes second", () => {
  const referentIngredient: Ingredient = { name: ["b"] };
  const input = {
    ingredients: [
      {
        name: ["a"],
        ingredients: [
          {
            name: ["c"],
            steps: [
              { text: [{ name: "@b" }] },
            ],
          },
          referentIngredient,
        ],
      },
    ],
  };

  new Resolver(input).resolve();

  const ingredient = input.ingredients.at(0)!.ingredients!.at(0)!;
  const step = ingredient.steps?.at(0)!;
  const identifier = step.text.at(0) as Identifier;

  assertEquals(
    identifier.ingredient,
    referentIngredient,
  );
});

Deno.test("it resolves global references inside ingredient", () => {
  const referentIngredient: Ingredient = { name: ["d", "e"] };
  const input = {
    ingredients: [
      referentIngredient,
      {
        name: ["a"],
        ingredients: [
          {
            name: ["b"],
            steps: [
              { text: [{ name: "@d-e" }] },
            ],
          },
        ],
      },
    ],
  };

  new Resolver(input).resolve();

  const ingredient = input.ingredients.at(1)!.ingredients!.at(0)!;
  const step = ingredient.steps?.at(0)!;
  const identifier = step.text.at(0) as Identifier;

  assertEquals(
    identifier.ingredient,
    referentIngredient,
  );
});

Deno.test("it resolves global references inside ingredient when referent comes second", () => {
  const globalIngredient: Ingredient = { name: ["d", "e"] };
  const input = {
    ingredients: [
      {
        name: ["a"],
        ingredients: [
          {
            name: ["b"],
            steps: [
              { text: [{ name: "@d-e" }] },
            ],
          },
        ],
      },
      { name: ["d", "e"] },
    ],
  };

  new Resolver(input).resolve();

  const ingredient = input.ingredients.at(0)!.ingredients!.at(0)!;
  const step = ingredient.steps?.at(0)!;
  const identifier = step.text.at(0) as Identifier;

  assertEquals(
    identifier.ingredient,
    globalIngredient,
  );
});

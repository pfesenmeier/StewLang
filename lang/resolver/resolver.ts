import { Environment } from "./environment.ts";
import type { Ingredient } from "../parser/ingredient.ts";
import type { Recipe } from "../parser/recipe.ts";

export class Resolver {
  constructor(
    public recipe: Recipe,
  ) {}

  public resolve() {
    const env = this.resolveGlobals();

    for (const ingredient of this.recipe.ingredients) {
      this.resolveIngredient(ingredient, env);
    }
  }

  private resolveIngredient(ingredient: Ingredient, env: Environment) {
    const subs = ingredient.ingredients ?? [];
    env = new Environment(env);
    for (const sub of subs) {
      env.define(sub.name, sub);
    }

    // TODO can an ingredient refer to itself?
    const steps = ingredient.steps ?? []
    const identifiers = steps
      .map((step) => step.text)
      .map((text) => text.filter((t) => typeof t !== "string")).flat();

    for (const identifier of identifiers) {
      const ingredient = env.getIngredient(identifier.name);
      if (ingredient === undefined) {
        throw new Error(`could not resolve ${identifier.name}`);
      }
      identifier.ingredient = ingredient
    }

    for (const sub of subs) {
      this.resolveIngredient(sub, env);
    }
  }

  private resolveGlobals(): Environment {
    const env = new Environment();
    for (const ingredient of this.recipe.ingredients) {
      env.define(ingredient.name, ingredient);
    }

    return env;
  }
}

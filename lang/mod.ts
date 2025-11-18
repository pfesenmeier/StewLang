import { Parser } from "./parser/parser.ts";
import { Resolver } from "./resolver/resolver.ts";
import { Scanner } from "./scanner/scanner.ts";
import type { Recipe } from "./parser/recipe.ts";
import { StewError } from "./parser/StewError.ts";

export class StewLang {
  public read(input: string): Readonly<Recipe | StewError> {
    const tokens = [...new Scanner().scan(input)];
    const recipe = new Parser(tokens).parse();

    if (recipe instanceof StewError) {
      return recipe;
    }

    new Resolver(recipe).resolve();

    return Object.freeze(recipe);
  }
}

export { StewError };
export type { Ingredient } from "./parser/ingredient.ts";
export type { Step } from "./parser/step.ts";
export type { Amount } from "./scanner/amount.ts";
export type { Recipe } from "./parser/recipe.ts";

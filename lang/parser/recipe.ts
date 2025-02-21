import type { Ingredient } from "./ingredient.ts";

export class Recipe {
  readonly __brand = "Recipe";
  constructor(
    public ingredients: Ingredient[],
    public meta: Record<string, string> = {},
  ) {}
}

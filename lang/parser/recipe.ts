import type { Ingredient } from "./ingredient.ts";

export type Recipe = {
  ingredients: Ingredient[];
  meta?: Record<string, string>;
}


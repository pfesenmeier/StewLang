import type { Ingredient } from "./ingredient.ts";

export type Identifier = {
  name: string;
  ingredient?: Ingredient;
};

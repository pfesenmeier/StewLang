import type { Ingredient } from "./ingredient.ts";

export class Recipe {
    constructor(
        public ingredients: Ingredient[],
    ) {}
}

import type { Ingredient } from "./ingredient.ts";

export class Step {
    constructor(
        public ingredientRefs: Ingredient,
        public text: string,
    ) {}
}


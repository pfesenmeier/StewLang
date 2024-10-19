import type { Ingredient } from "./ingredient.ts";
import type { Step } from "./step.ts";

export class Recipe {
    public Ingredients: Array<Ingredient> = [];
    public Steps: Array<Step> = [];

    constructor(
        public Name: string,
    ) {}
}

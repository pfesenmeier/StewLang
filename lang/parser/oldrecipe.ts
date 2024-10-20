import type { Ingredient } from "./ingredient.ts";
import type { Step } from "./step.ts";

export class Recipe {
    public Ingredients: Ingredient[]
    public Steps: Step[]

    constructor(
        public Name: string,
        ingredients?: Ingredient[],
        steps?: Step[] 
    ) {
        this.Ingredients = ingredients ?? [];
        this.Steps = steps ?? []
    }
}

import type { Ingredient } from "../parser/ingredient.ts";
import type { Recipe } from "../parser/recipe.ts";
import type { Step } from "../parser/step.ts";
import type { Amount } from "../scanner/amount.ts";

export interface IInterpreter<T> {
    interpret(node: Node): T
}

export type Node =
    | Recipe
    | Ingredient
    | Amount
    | Step;

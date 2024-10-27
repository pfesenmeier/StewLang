import type { Amount } from "../scanner/amount.ts";
import type { Ingredient } from "./ingredient.ts";
import type { Recipe } from "./recipe.ts";
import type { Step } from "./step.ts";

export interface IInterpreter {
    interpret(type: Type): void;
}

type Type =
    | Recipe
    | Ingredient
    | Step
    | Amount

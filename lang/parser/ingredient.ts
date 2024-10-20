import type { Amount } from "../scanner/amount.ts";
import type { Step } from "./step.ts";

export type Detail = Step | Ingredient

export class Ingredient
{
    constructor(
        public name: string[],
        public amount?: Amount,
        public detail?: Detail[]
    ) {}
}

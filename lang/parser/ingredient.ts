import type { Amount } from "../scanner/amount.ts";
import type { Step } from "./step.ts";

export type Detail = Step | Ingredient

export class Ingredient
{
    readonly __brand = "Ingredient"

    public amount?: Amount
    public detail?: Detail[]

    constructor(
        public name: string[],
        opts?: {
          amount?: Amount,
          detail?: Detail[]
        }
    ) {
        this.amount = opts?.amount
        this.detail = opts?.detail
    }
}

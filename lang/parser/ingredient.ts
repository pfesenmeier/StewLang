import type { Amount } from "../scanner/amount.ts";
import type { Step } from "./step.ts";

export type Detail = Step | Ingredient;

export class Ingredient {
    readonly __brand = "Ingredient";
    private static id_sep = ":";
    private static name_sep = "-"

    public amount?: Amount;
    public detail?: Detail[];
    public id: string;

    constructor(
        public name: string[],
        opts?: {
            amount?: Amount;
            detail?: Detail[];
            parent?: Ingredient;
        },
    ) {
        this.amount = opts?.amount;
        this.detail = opts?.detail;

        if (opts?.parent) {
            this.id = opts.parent.id + Ingredient.id_sep + this.name;
        } else {
            this.id = this.name.join(Ingredient.name_sep)
        }
    }
}

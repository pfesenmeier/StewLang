import type { Identifier } from "./identifier.ts";

export class Step {
    readonly __brand = "Step"
    constructor(
        public text: StepWord[],
    ) {}
}

export type StepWord = string | Identifier


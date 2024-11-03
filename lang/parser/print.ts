import { Expression } from "./expression.ts";

export class Print {
    public readonly __brand = "Print"
    constructor(
        public expression: Expression
    ) {}
}

import { Statement } from "./statement.ts";

export class Recipe {
    readonly __brand = "Recipe" 
    constructor(
        public ingredients: Statement[],
        public meta: Record<string, string> = {}
    ) {}
}

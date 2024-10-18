import type { Token } from "./scanner.ts";

export class Parser {
    public parse(input: Iterable<Token>): Expression {
    }
}

class Statement
{
    constructor(
    ) {}
}

class Quantity
{
    constructor(
        public amount: number,
        public quantity: 
    ) {}
}

class Ingredient
{
    constructor() {}
}

/**
 * a recipe is a statement
 *
 * recipe - list of ingredients (amount, name, text)
 * plus list of steps (refs to ingredients (own + others), text)
 * ?should be allowed to declare in any order? - yes
 * list of little recipes
 * turn the step into a 
 *
 */

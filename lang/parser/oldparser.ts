import { Amount } from "../scanner/amount.ts";
import { type Token, TokenType } from "../scanner/scanner.ts";
import { Ingredient } from "./ingredient.ts";
import { Recipe } from "./recipe.ts";

export class Parser {
    private currentRecipe: Recipe | null = null;
    constructor(
        private tokens: Array<Token>,
    ) {}

    public *parse(): Iterable<Recipe> {
        while (true) {
            const next = this.tokens.shift();
            if (next === undefined) return;

            if (this.currentRecipe === null) {
                this.parseRecipe();
                yield 
                continue;
            }
        }
    }

    parseRecipe() {
        this.expect(
            () => this.peekNext()?.type === TokenType.WORD,
            "expected a named for a recipe",
        );
        this.currentRecipe = new Recipe(this.takeNext().value);

        this.expect(
            () => this.takeNext()?.type === TokenType.LEFT_PARENS,
            "expected a '{'",
        );
        while (this.peekNext()?.type === TokenType.NEWLINE) this.takeNext();

        // ingredients?
        if (
            this.isMatch(this.peekNext()?.type, [
                TokenType.AMOUNT,
                TokenType.WORD,
                TokenType.IDENTIFIER,
            ])
        ) {
            const ingredient = new Ingredient();

            // optional amount at beginning
            if (this.peekNext()?.type === TokenType.AMOUNT) {
                ingredient.amount = Amount.fromString(this.takeNext().value);
            }

            const wordTokens = [];

            while (
                this.isMatch(this.peekNext()?.type, [
                    TokenType.WORD,
                    TokenType.IDENTIFIER,
                ])
            ) {
                wordTokens.push(this.takeNext())
            }

            if (wordTokens.length === 1) {
                ingredient.name = wordTokens[0]!.value
                ingredient.text = wordTokens[0]!.value
            } else if (wordTokens.find(w => w.type === TokenType.IDENTIFIER)) {
                let idToken = wordTokens.find(w => w.type === TokenType.IDENTIFIER)
                ingredient.name = idToken!.value
                ingredient.text = wordTokens.join(" ")
            } else {
                throw new Error("Ingredient needs a name!")
            }
            
}  

    private isMatch(
        type: typeof TokenType[keyof typeof TokenType],
        expectedTypes: typeof TokenType[keyof typeof TokenType][],
    ): boolean {
        return expectedTypes.includes(type);
    }

    private peekNext(): Token {
        const next = this.tokens.at(0);

        if (next === undefined) {
            throw new Error("no tokens left!");
        }

        return next;
    }

    private takeNext(): Token {
        const next = this.tokens.shift();

        if (next === undefined) {
            throw new Error("no tokens left!");
        }

        return next;
    }

    private expect(fn: () => boolean, errMessage: string) {
        if (!fn()) {
            throw new Error(errMessage);
        }
    }
}

/**
 * "recipe"
 * meal plan
 *
 * import { pbj } from './pbj'
 *
 * monday [
 *   @pbj
 * ]
 *
 * foo {}
 * bar { foo }
 *
 * return @bar
 *
 * a recipe is a thing with ingredients / steps
 * or a thing with named ingredients / step
 * ((1 + 2 ) * 3)
 * (topping + (main: prep + cook))
 *
 * recipe - list of ingredients (amount, name, text)
 * plus list of steps (refs to ingredients (own + others), text)
 * ?should be allowed to declare in any order? - yes
 * list of little recipes
 * turn the step into a
 */

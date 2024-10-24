import { Amount } from "../scanner/amount.ts";
import { type Token, TokenType } from "../scanner/scanner.ts";
import { type Detail, Ingredient } from "./ingredient.ts";
import { Recipe } from "./recipe.ts";
import { Step } from "./step.ts";

export class Parser {
    private index = 0;
    private ingredients: Ingredient[] = [];

    constructor(
        private tokens: Token[],
    ) {}

    public parse(): Recipe {
        this.recipe();
        return new Recipe(this.ingredients);
    }

    private recipe() {
        while (!this.isAtEnd()) {
            this.ingredients.push(this.ingredient());
        }
    }

    private ingredient() {
        const name: string[] = [];
        let amount: Amount | undefined;

        if (this.match([TokenType.AMOUNT])) {
            amount = Amount.fromString(this.getPrevious().value);
        }

        while (this.match([TokenType.WORD])) {
            name.push(this.getPrevious().value);
        }

        if (name.length === 0) {
            throw new Error("expected recipe name");
        }

        if (this.match([TokenType.LEFT_PARENS])) {
            this.consumeNewline();

            if (this.match([TokenType.RIGHT_PARENS])) {
                return new Ingredient(name, amount);
            }

            const detail = this.detail();

            return new Ingredient(name, amount, detail);
        }

        this.consumeNewline();

        return new Ingredient(name, amount);
    }

    private detail(): Detail[] {
        const detail: Detail[] = [];
        while (!this.match([TokenType.RIGHT_PARENS])) {
            if (this.getCurrent()?.type === TokenType.DASH) {
                const step: Step = this.step();
                detail.push(step);
            } else {
                const ingredient = this.ingredient();
                detail.push(ingredient);
            }
            this.consumeNewline();
        }

        return detail;
    }

    step(): Step {
        this.expect(TokenType.DASH, "expected a dash");

        const words: string[] = [];
        while (this.match([TokenType.WORD])) {
            words.push(this.getPrevious().value);
        }

        return new Step(words);
    }

    private expect(
        type: typeof TokenType[keyof typeof TokenType],
        msg: string,
    ) {
        if (this.getCurrent().type !== type) {
            throw new Error(msg);
        }

        return this.advance();
    }

    private match(tokenTypes: typeof TokenType[keyof typeof TokenType][]) {
        if (this.isAtEnd()) return false;
        if (tokenTypes.includes(this.getCurrent().type)) {
            this.advance();
            return true;
        }

        return false;
    }

    private advance() {
        this.index++;
        return this.getPrevious();
    }

    private getCurrent() {
        return this.tokens[this.index];
    }

    private isAtEnd() {
        return this.index === this.tokens.length;
    }

    private getPrevious() {
        return this.tokens[this.index - 1];
    }

    private consumeNewline() {
        if (this.match([TokenType.NEWLINE])) {
            // consume
        }
    }
}

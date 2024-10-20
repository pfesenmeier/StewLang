import { type Token, TokenType } from "../scanner/scanner.ts";
import { Ingredient, type Detail } from "./ingredient.ts";
import { Recipe } from "./recipe.ts";


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
        const name = this.expect(TokenType.WORD, "expected recipe name");

        if (this.getCurrent()?.type === TokenType.LEFT_PARENS) {
            this.advance()

            if (this.getCurrent()?.type === TokenType.RIGHT_PARENS) {
                this.advance()
                return new Ingredient([name.value])
            }

            const detail = this.detail()
            this.expect(TokenType.RIGHT_PARENS, "expected right parens");

            return new Ingredient([name.value], undefined, detail)
        }

        return new Ingredient([name.value])
    }

    private detail(): Detail[]
    {
        const detail: Detail[] = []
        if (this.getCurrent()?.type === TokenType.DASH)
        {
            // TODO
        } else {
            const ingredient = this.ingredient()
            detail.push(ingredient)
        }

        return detail
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

    private peek() {
        if (this.isAtEnd()) return undefined
        return this.tokens[this.index + 1];
    }
}

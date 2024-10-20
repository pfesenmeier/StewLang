import { TokenType, type Token } from "../scanner/scanner.ts";
import { Recipe } from "./recipe.ts";

export class Parser {
    private index = 0;
    private recipes: Recipe[] = []
    constructor(
        private tokens: Token[],
    ) {}

    public parse(): Recipe[] {
        this.program()
        return this.recipes
    }

    private program() {
        while(!this.isAtEnd()){
            this.recipe()
        }
    }

    private recipe() {
        const name = this.expect(TokenType.WORD, "expected recipe name")
        this.expect(TokenType.LEFT_PARENS, "expected left parens")
        this.expect(TokenType.RIGHT_PARENS, "expected right parens")
        this.recipes.push(new Recipe(name.value))
    }

    private expect(type: typeof TokenType[keyof typeof TokenType], msg: string) {
        if (this.getCurrent().type !== type) {
            throw new Error(msg)
        }

        return this.advance()
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
        return this.tokens[this.index + 1];
    }
}

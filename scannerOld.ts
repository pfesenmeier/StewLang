export class Scanner {
    private tokens: Token[] = [];
    private index = 0;

    constructor(
        private source: string,
    ) {
    }

    scan(): Token[] {
        try {
            while (!this.isAtEnd()) {
                const next = this.advance();
                switch (next) {
                    case "{":
                        this.addToken(tokenType.LEFT_CURLY_BRACE, next);
                        break;
                    case "}":
                        this.addToken(tokenType.RIGHT_CURLY_BRACE, next);
                        break;
                    case "-":
                        this.addToken(tokenType.DASH, next);
                        break;
                    case "@": {
                        const start = this.index;

                        if (
                            this.isAtEnd() || !this.isAlphaNumeric(this.peek())
                        ) {
                            throw new Error(
                                "identifiers must contain at least one alphanumeric character",
                            );
                        }

                        while (this.isAlphaNumeric(this.peek())) {
                            this.advance();
                        }

                        this.addToken(
                            tokenType.IDENTIFIER,
                            this.source.substring(start, this.index),
                        );
                        break;
                    }
                    default:
                        if (this.isAlphaNumeric(next)) {
                            const start = this.index;
                            while (this.isAlphaNumeric(this.peek())) {
                                this.advance();
                            }

                            this.addToken(
                                tokenType.WORD,
                                this.source.substring(start, this.index),
                            );
                        }
                }
            }
        } catch (err) {
            console.error(err);
        }

        return this.tokens;
    }

    private isAlphaNumeric(input: string) {
        return input.match(/[A-Za-z\-_]/g)?.length == input.length;
    }

    private addToken(tokenType: TokenType, literal: string): void {
        this.tokens.push(new Token(tokenType, literal));
    }

    private peek(): string {
        return this.source[this.index + 1];
    }

    private advance(): string {
        return this.source[this.index++];
    }

    private isAtEnd(): boolean {
        return this.index == this.source.length;
    }

    getTokens = () => this.tokens;
}

class Token {
    constructor(
        public type: TokenType,
        public value: string,
    ) {}
}

const tokenType = {
    LEFT_CURLY_BRACE: 1,
    RIGHT_CURLY_BRACE: 2,
    DASH: 5,

    NEWLINE: 4,
    WHITESPACE: 7,

    IDENTIFIER: 0,
    AMOUNT: 3,
    WORD: 6,
};

type TokenType = typeof tokenType[keyof typeof tokenType];

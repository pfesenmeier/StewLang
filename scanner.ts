export class Scanner {
    private source: string = "";
    private index = 0;

    constructor() {
        this.scan.bind(this);
    }

    public *scan(source: string) {
        this.source = source;
        try {
            while (!this.cannotAdvance()) {
                const current = this.advance();
                switch (current) {
                    case "{":
                        yield this.createToken(
                            TokenType.LEFT_CURLY_BRACE,
                            current,
                        );
                        break;
                    case "}":
                        yield this.createToken(
                            TokenType.RIGHT_CURLY_BRACE,
                            current,
                        );
                        break;
                    default:
                        if (this.isAlphaNumeric(current)) {
                            const start = this.index - 1;
                            while (
                                !this.cannotAdvance() &&
                                this.isAlphaNumeric(this.peek())
                            ) {
                                this.advance();
                            }

                            const word = this.source.substring(
                                start,
                                this.index,
                            );

                            yield this.createToken(
                                TokenType.WORD,
                                word,
                            );
                        }
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            this.index = 0;
        }
    }

    private isAlphaNumeric(input: string) {
        return input.match(/[A-Za-z\-_]/g)?.length == input.length;
    }

    private createToken(tokenType: TokenType, literal: string): Token {
        return new Token(tokenType, literal);
    }

    private peek(): string {
        return this.source[this.index];
    }

    private advance(): string {
        return this.source[this.index++];
    }

    private cannotAdvance(): boolean {
        return this.index === this.source.length;
    }
}

export class Token {
    constructor(
        public type: TokenType,
        public value: string,
    ) {}
}

export const TokenType = {
    LEFT_CURLY_BRACE: 1,
    RIGHT_CURLY_BRACE: 2,
    DASH: 5,

    NEWLINE: 4,
    WHITESPACE: 7,

    IDENTIFIER: 0,
    AMOUNT: 3,
    WORD: 6,
};

type TokenType = typeof TokenType[keyof typeof TokenType];

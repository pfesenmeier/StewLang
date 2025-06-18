export class Scanner {
  private source: string = "";
  private index = 0;

  constructor() {
    this.scan.bind(this);
  }

  public *scan(source: string): Iterable<Token> {
    this.source = source;
    try {
      while (!this.cannotAdvance()) {
        const current = this.advance();
        switch (current) {
          case "-":
            yield this.createToken(
              TokenType.DASH,
              current,
            );
            break;
          case "\r":
            if (!this.cannotAdvance() && this.peek() === "\n") {
              const next = this.advance();
              yield this.createToken(
                TokenType.NEWLINE,
                current + next,
              );
            }
            break;
          case "\n":
            yield this.createToken(
              TokenType.NEWLINE,
              current,
            );
            break;
          case "(":
            yield this.createToken(
              TokenType.LEFT_PARENS,
              current,
            );
            break;
          case ")":
            yield this.createToken(
              TokenType.RIGHT_PARENS,
              current,
            );
            break;
          case "@": {
            const start = this.index - 1;
            while (
              !this.cannotAdvance() &&
              this.isWordCharacter(this.peek())
            ) {
              this.advance();
            }

            const word = this.source.substring(
              start,
              this.index,
            );
            yield this.createToken(
              TokenType.IDENTIFIER,
              word,
            );
            break;
          }
          case "$": {
            const start = this.index - 1;
            while (
              !this.cannotAdvance() &&
              this.isWordCharacter(this.peek())
            ) {
              this.advance();
            }

            const word = this.source.substring(
              start,
              this.index,
            );
            yield this.createToken(
              TokenType.META,
              word,
            );
            break;
          }
          default:
            if (this.isNumber(current)) {
              const start = this.index - 1;
              while (
                !this.cannotAdvance() &&
                (
                  this.isNumberCharacter(this.peek())
                )
              ) {
                this.advance();
              }

              const amount = this.source.substring(
                start,
                this.index,
              );

              yield this.createToken(
                TokenType.NUMBER,
                amount,
              );
            }

            if (this.isWordCharacter(current)) {
              const start = this.index - 1;
              while (
                !this.cannotAdvance() &&
                this.isWordCharacter(this.peek())
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

  private isWordCharacter(input: string) {
    return input.match(/[A-Za-z\-]/) !== null;
  }

  private isNumber(input: string) {
    return input.match(/[0-9]/) !== null;
  }

  private isNumberCharacter(input: string) {
    return input.match(/[0-9\.\/]/) !== null;
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
  LEFT_PARENS: "LEFT_PARENS",
  RIGHT_PARENS: "RIGHT_PARENS",
  DASH: "DASH",

  NEWLINE: "NEWLINE",
  WHITESPACE: "WHITESPACE",
  NUMBER: "NUMBER",

  IDENTIFIER: "IDENTIFIER",
  META: "META",
  WORD: "WORD",
};

type TokenType = typeof TokenType[keyof typeof TokenType];

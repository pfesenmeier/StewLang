import { Amount } from "../scanner/amount.ts";
import { type Token, TokenType } from "../scanner/scanner.ts";
import { Identifier } from "./identifier.ts";
import { type Detail, Ingredient } from "./ingredient.ts";
import { Recipe } from "./recipe.ts";
import { Step, type StepWord } from "./step.ts";

export class Parser {
  private index = 0;
  private ingredients: Ingredient[] = [];
  private meta: Record<string, string> = {};

  constructor(
    private tokens: Token[],
  ) {}

  public parse(): Recipe {
    this.recipe();
    return new Recipe(this.ingredients, this.meta);
  }

  private recipe() {
    while (this.match([TokenType.META])) {
      const key = this.getPrevious().value;
      const values: string[] = [];
      while (this.match([TokenType.WORD])) {
        values.push(this.getPrevious().value);
      }
      this.match([TokenType.NEWLINE]);
      this.meta[key] = values.join(" ");
    }
    while (!this.isAtEnd()) {
      // handle newlines
      if (!this.match([TokenType.NEWLINE, TokenType.WHITESPACE])) {
        this.ingredients.push(this.ingredient());
      }
    }
  }

  private ingredient(parent?: Ingredient) {
    const name: string[] = [];
    let amtNum: number | undefined;
    let amount: Amount | undefined = undefined;

    if (this.match([TokenType.NUMBER])) {
      const amtString = this.getPrevious().value;
      if (amtString) {
        amtNum = Amount.parseAmount(amtString);
      }
    }

    if (this.getCurrent().value === TokenType.WORD) {
      const unit = Amount.parseUnit(this.getCurrent().value) ?? undefined;
      if (unit) {
        amount = new Amount(amtNum ?? 1, unit);
        this.advance();
      }
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
        return new Ingredient(name, { amount, parent });
      }

      const ingredient = new Ingredient(name, { amount, parent });
      const detail = this.detail(ingredient);
      ingredient.detail = detail;

      return ingredient;
    }

    this.consumeNewline();

    return new Ingredient(name, { amount, parent });
  }

  private detail(parent?: Ingredient): Detail[] {
    const detail: Detail[] = [];
    while (!this.match([TokenType.RIGHT_PARENS])) {
      if (this.match([TokenType.DASH])) {
        const step: Step = this.step();
        detail.push(step);
      } else {
        const ingredient = this.ingredient(parent);
        detail.push(ingredient);
      }
      this.consumeNewline();
    }

    return detail;
  }

  step(): Step {
    const words: StepWord[] = [];
    while (this.match([TokenType.WORD, TokenType.IDENTIFIER])) {
      const previous = this.getPrevious();
      if (previous.type === TokenType.WORD) {
        words.push(previous.value);
      } else {
        words.push(new Identifier(previous.value));
      }
    }

    return new Step(words);
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

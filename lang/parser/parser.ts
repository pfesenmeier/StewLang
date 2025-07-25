import {
  type Amount,
  parseAmount,
  parseAmountNumber,
} from "../scanner/amount.ts";
import { type Token, TokenType } from "../scanner/scanner.ts";
import type { Ingredient } from "./ingredient.ts";
import type { Recipe } from "./recipe.ts";
import type { Step, StepWord } from "./step.ts";

export class Parser {
  private index = 0;
  private ingredients: Ingredient[] = [];
  private meta: Record<string, string> | null = null;

  constructor(private tokens: Token[]) {}

  public parse(): Recipe {
    this.recipe();
    return {
      ingredients: this.ingredients,
      ...(this.meta && { meta: this.meta }),
    };
  }

  private recipe() {
    while (this.match([TokenType.META])) {
      const key = this.getPrevious().value;
      const values: string[] = [];
      while (this.match([TokenType.WORD])) {
        values.push(this.getPrevious().value);
      }
      this.match([TokenType.NEWLINE]);

      if (this.meta === null) {
        this.meta = {};
      }

      this.meta[key] = values.join(" ");
    }
    while (!this.isAtEnd()) {
      // handle newlines
      if (!this.match([TokenType.NEWLINE, TokenType.WHITESPACE])) {
        this.ingredients.push(this.ingredient());
      }
    }
  }

  private ingredient(parent?: Ingredient): Ingredient {
    const name: string[] = [];
    let amount: Amount | null = null;

    if (this.match([TokenType.NUMBERWORD])) {
      const amtString = this.getPrevious().value;
      amount = parseAmount(amtString);
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
        return {
          name,
          ...(amount && { amount }),
          ...(parent && { parent }),
        };
      }

      const ingredient: Ingredient = {
        name,
        ...(amount && { amount }),
        ...(parent && { parent }),
      };
      const { steps, ingredients } = this.detail(ingredient);

      if (steps && steps.length > 0) {
        ingredient.steps = steps;
      }

      if (ingredients && ingredients.length > 0) {
        ingredient.ingredients = ingredients;
      }

      return ingredient;
    }

    this.consumeNewline();

    return { name, ...(amount && { amount }), ...(parent && { parent }) };
  }

  private detail(
    parent?: Ingredient,
  ): { steps: Step[]; ingredients: Ingredient[] } {
    const ingredients: Ingredient[] = [];
    const steps: Step[] = [];
    while (!this.match([TokenType.RIGHT_PARENS])) {
      if (this.match([TokenType.DASH])) {
        const step: Step = this.step();
        steps.push(step);
      } else {
        const ingredient = this.ingredient(parent);
        ingredients.push(ingredient);
      }
      this.consumeNewline();
    }

    return {
      steps,
      ingredients,
    };
  }

  step(): Step {
    const text: StepWord[] = [];
    while (this.match([TokenType.WORD, TokenType.IDENTIFIER, TokenType.NUMBERWORD])) {
      const previous = this.getPrevious();
      if ([TokenType.WORD, TokenType.NUMBERWORD].includes(previous.type)) {
        text.push(previous.value);
      } else {
        text.push({ name: previous.value });
      }
    }

    return { text };
  }

  private match(tokenTypes: (typeof TokenType)[keyof typeof TokenType][]) {
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

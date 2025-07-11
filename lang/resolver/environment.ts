import type { Ingredient } from "../parser/ingredient.ts";

export class Environment {
  private env: Record<string, Ingredient> = {};
  private parent: Environment | undefined;

  constructor(
    parent?: Environment,
  ) {
    this.parent = parent;
  }

  public define(name: string[], ingredient: Ingredient) {
    this.env[name.join("-")] = ingredient;
  }

  public getIngredient(name: string): Ingredient | undefined {
    return this.env[name.slice(1)] ?? this.parent?.getIngredient(name);
  }
}

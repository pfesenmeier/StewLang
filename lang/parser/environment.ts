import type { Ingredient } from "./ingredient.ts";

export class Environment {
    private id: string | undefined;
    private env: Record<string, Ingredient> = {};
    private parent: Environment | undefined;

    constructor(
        name?: string,
        parent?: Environment,
    ) {
        this.parent = parent;
        if (parent) {
            if (parent.id) {
                this.id = parent.id + ":" + name;
            } else {
                this.id = name
            }
        }
    }

    public define(ingredient: Ingredient) {
        this.env[ingredient.name.join("-")] = ingredient;
    }

    public getId(name: string): string | undefined {
        if (this.env[name]) {
            if (this.id) {
                return this.id + ":" + name;
            } else {
                return name;
            }
        } else {
            return this.parent?.getId(name);
        }
    }
}

import { Parser } from "./parser/parser.ts";
import type { Recipe } from "./parser/recipe.ts";
import { Resolver } from "./resolver/resolver.ts";
import { Scanner } from "./scanner/scanner.ts";

export class StewLang {
    public read(input: string): Readonly<Recipe> {
        const tokens = [...new Scanner().scan(input)];
        const recipe = new Parser(tokens).parse();
        new Resolver(recipe).resolve();

        return Object.freeze(recipe);
    }
}

export type { Recipe };

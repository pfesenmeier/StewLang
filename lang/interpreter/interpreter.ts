import type { Ingredient } from "../parser/ingredient.ts";
import type { Recipe } from "../parser/recipe.ts";
import type { Step } from "../parser/step.ts";
import type { Amount } from "../scanner/amount.ts";
import type { IInterpreter, Node } from "./IInterpreter.ts";

class IngredientLink
{
    constructor(
        public startIndex: number,
        public endIndex: number,
        public id: string
    ){}
}

class StepResult
{
    private links: IngredientLink[] = []
    constructor(
        public text: string
    ) {}
}


class LinkCollection {
    private collection: Record<string, Link> = {};
    public add(link: Link) {
        this.collection[link.text] = link;
    }

    public tryGet(text: string): Link | undefined {
        return this.collection[text];
    }
}
// nested 'ingredients'...

class Link {
    constructor(
        public text: string,
        public href: string,
    ) {}
}

export class Interpreter implements IInterpreter<string> {
    private links = new LinkCollection();
    private ingredientStack: string[] = [];

    constructor(
        private recipe: Recipe,
    ) {}

    interpret(node: Node): string {
        if (node.__brand == "Ingredient") return this.interpretIngredient(node);
        if (node.__brand == "Recipe") return this.interpretRecipe(node);
        if (node.__brand == "Amount") return this.interpretAmount(node);
        if (node.__brand == "Step") return this.interpretStep(node);
    }

    private interpretRecipe(node: Recipe): string {
        const inner = node.ingredients.map((i) => this.interpretIngredient(i));
        return `<h1>MyRecipe</h1><ul>${inner}</ul>`;
    }

    interpretStep(node: Step): string {
        throw new Error("Method not implemented.");
    }
    interpretAmount(node: Amount): string {
        throw new Error("Method not implemented.");
    }
    interpretIngredient(node: Ingredient): string {
        // push current ingredient
        this.ingredientStack.push(node.name.join("_"));
        const inner = node.detail?.map((d) => {
            if (d.__brand == "Ingredient") return this.interpretIngredient(d);
            return this.interpretStep(d);
        });
        const depth = this.ingredientStack.length + 1
        const id = this.ingredientStack.join(":")
        this.ingredientStack.pop();


        return `
<h${depth} id=${id}>${node.amount} ${node.name}</h${depth}>
<h${depth + 1}>Ingredients</h${depth + 1}> 
<

`
        // pop current ingredient
        throw new Error("Function not implemented.");
    }
}

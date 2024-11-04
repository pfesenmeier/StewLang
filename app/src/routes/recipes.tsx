import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Recipe, StewLang } from "../lang/mod.ts";

export const Route = createFileRoute("/recipes")({
    component: RouteComponent,
    validateSearch: (search: Record<string, string>) => {
        const recipes: Record<string, Recipe> = {};

        const raw = search["recipes"]
        if (raw === "") {
            return  []
        }
        const input: string[] = JSON.parse(raw);
        const lang = new StewLang();

        for (const [name, recipe] of Object.entries(input)) {
            recipes[name] = lang.read(recipe);
        }

        return recipes;
    },
});

function RouteComponent() {
    const recipes: Recipe[]   = Route.useSearch();
    console.log(recipes)

    const Ingredient = ({ name }: { name: string }) => <div>{name}</div>;

    return (
        <div>
            {recipes.map((r) => (
                <div>
                    {r.ingredients.map((i) => (
                        <Ingredient name={i.name.join(" ")} />
                    ))}
                </div>
            ))}
        </div>
    );
}

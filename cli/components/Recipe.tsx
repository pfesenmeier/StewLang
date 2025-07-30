import type { Recipe } from "@stew/lang";
import { Box } from "ink";
import Ingredient from "./Ingredient.tsx";
import { appSurfaceColors } from "../colors/mod.ts";

const surfaceGenerator = appSurfaceColors();

export default function Recipe(
  { recipe, current }: { recipe: Recipe; current?: number },
) {
  const tabColors: string[] = [];

  for (let i = 0; i < recipe.ingredients.length; i++) {
    const color = surfaceGenerator.next().value!;
    tabColors.push(color);
  }

  const ingredient = recipe.ingredients[current ?? 0];

  return (
    <Box>
      {recipe.ingredients.map((ingredient, i) => (
        <Box
          backgroundColor={tabColors[i]}
          key={ingredient.name.join()}
        >
          {ingredient.name}
        </Box>
      ))}
      <Box borderColor="cyan" padding={1} flexDirection="column">
        <Ingredient ingredient={ingredient} />
      </Box>
    </Box>
  );
}

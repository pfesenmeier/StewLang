import type { Recipe } from "@stew/lang";
import { Box, Text } from "ink";
import Ingredient from "./Ingredient.tsx";
import { useBase16 } from "../colors/Base16Context.tsx";

export default function Recipe(
  { recipe, current }: { recipe: Recipe; current?: number | null },
) {
  const theme = useBase16();
  const tabColors: string[] = [];

  for (let i = 0; i < recipe.ingredients.length; i++) {
    const color = theme.surfaceColorsIndexed.get(i);
    tabColors.push(color);
  }

  const ingredient = recipe.ingredients[current ?? 0];

  return (
    <Box flexDirection="column">
      <Box>
        {recipe.ingredients.map((ingredient, i) => (
          <Text
            backgroundColor={tabColors[i]}
            key={ingredient.name.join()}
          >
            {" " + ingredient.name + " "}
          </Text>
        ))}
      </Box>
      {typeof current === "number" && (
        <Box
          padding={1}
          backgroundColor={tabColors[current]}
        >
          <Ingredient ingredient={ingredient} />
        </Box>
      )}
    </Box>
  );
}

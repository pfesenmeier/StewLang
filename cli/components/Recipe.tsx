import type { Recipe } from "@stew/lang";
import { Box } from "ink";
import Ingredient from "./Ingredient.tsx";

export default function Recipe({ recipe }: { recipe: Recipe }) {
  return (
    <Box borderColor="cyan" padding={1} flexDirection="column">
      {recipe.ingredients.map((i) => (
        <Ingredient ingredient={i} key={i.name.join("_")} />
      ))}
    </Box>
  );
}

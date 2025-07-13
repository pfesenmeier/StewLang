import type { Ingredient } from "@stew/lang";
import { Box, Text } from "ink";

export default function Ingredient({ ingredient }: { ingredient: Ingredient }) {
  return (
    <Box
      borderColor="blueBright"
      borderStyle="singleDouble"
      padding={1}
      flexDirection="column"
    >
      <Box>
        <Text>{ingredient?.amount?.amount}</Text>
        <Text>{ingredient?.amount?.unit}</Text>
        <Text color="blue">{ingredient.name.join(" ")}</Text>
      </Box>
      {ingredient.steps && (
        <Box borderColor="magenta" flexDirection="column">
          {/* todo allow for 1 step asides to be placed to the right of the ingredient */}
          {ingredient.steps.map((step, index) => (
            <Text color="magenta" key={index}>{step.text.join(" ")}</Text>
          ))}
        </Box>
      )}
      {ingredient.ingredients && (
        <Box flexDirection="column">
          {ingredient.ingredients.map((subIngredient, index) => (
            <Ingredient ingredient={subIngredient} key={index} />
          ))}
        </Box>
      )}
    </Box>
  );
}

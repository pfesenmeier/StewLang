import type { Ingredient } from "@stew/lang";
import { Box, Text } from "ink";

export default function Ingredient({ ingredient }: { ingredient: Ingredient }) {
  return (
    <Box
      borderColor="blueBright"
      borderStyle="round"
      padding={1}
      flexDirection="column"
    >
      <Box gap={1} flexDirection="row">
        <Text>{ingredient?.amount?.amount}</Text>
        <Text>{ingredient?.amount?.unit}</Text>
        <Text color="blue" backgroundColor="black" bold>
          {" " + ingredient.name.join(" ") + " "}
        </Text>
      </Box>
      {ingredient.ingredients && (
        <Box flexDirection="row" flexWrap="wrap">
          {ingredient.ingredients.map((subIngredient, index) => (
            <Ingredient ingredient={subIngredient} key={index} />
          ))}
        </Box>
      )}
      {ingredient.steps && (
        <Box borderStyle="round" borderColor="magenta" flexDirection="column">
          {/* todo allow for 1 step asides to be placed to the right of the ingredient */}
          {ingredient.steps.map((step, index) => (
            <Text backgroundColor="black" color="magenta" key={index}>
              {` ${index + 1}. ` +
                step.text.join(" ") + " "}
            </Text>
          ))}
        </Box>
      )}
    </Box>
  );
}

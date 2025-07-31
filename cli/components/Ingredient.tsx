import type { Ingredient } from "@stew/lang";
import { Box, Text } from "ink";
import { useBase16 } from "../colors/Base16Context.tsx";
import Step from "./Step.tsx";

export default function Ingredient(
  { ingredient, tabWidths }: {
    ingredient: Ingredient;
    tabWidths?: TabWidths;
  },
) {
  const theme = useBase16();

  const childTabWidths = getTabWidths(ingredient.ingredients ?? []);

  return (
    <Box flexDirection="column">
      <Box flexDirection="row">
        <Text color={theme.base09}>
          {getStr(ingredient, tabWidths, "amount")}
        </Text>
        <Text color={theme.base0E}>
          {getStr(ingredient, tabWidths, "unit")}
        </Text>
        <Text color={theme.base0B} bold>
          {getStr(ingredient, tabWidths, "name")}
        </Text>
        {ingredient.steps && ingredient.steps.length === 1 && (
          <>
            <Text></Text>
            <Step step={ingredient.steps.at(0)!} />
          </>
        )}
      </Box>
      {ingredient.ingredients && (
        <Box flexDirection="column" paddingTop={1}>
          {ingredient.ingredients.map((subIngredient, index) => (
            <Box>
              <Ingredient
                ingredient={subIngredient}
                key={index}
                tabWidths={childTabWidths}
              />
            </Box>
          ))}
        </Box>
      )}
      {ingredient.steps && ingredient.steps.length > 1 && (
        <Box flexDirection="column">
          {/* todo allow for 1 step asides to be placed to the right of the ingredient */}
          {ingredient.steps.map((step, index) => (
            <Step key={index} step={step} index={index + 1} />
          ))}
        </Box>
      )}
    </Box>
  );
}

function getTabWidths(ingredients: Ingredient[]): TabWidths {
  const amount = calculateTabWidth(ingredients, "amount");
  const unit = calculateTabWidth(ingredients, "unit");
  const name = calculateTabWidth(ingredients, "name");

  return { amount, unit, name };
}

type TabWidths = {
  amount: number;
  unit: number;
  name: number;
};

function getStr(
  ingredient: Ingredient,
  tabWidths: TabWidths | undefined,
  prop: keyof TabWidths,
): string {
  let stringValue = "";

  if (prop === "amount") {
    const amountNumber = ingredient.amount?.amount;
    if (typeof amountNumber === "number") {
      stringValue = amountNumber.toString();
    }
  } else if (prop === "unit") {
    stringValue = ingredient.amount?.unit ?? "";
  } else if (prop === "name") {
    stringValue = ingredient.name.join(" ");
  }

  if (!tabWidths) {
    return stringValue;
  }

  return stringValue.padEnd(tabWidths[prop], " ");
}

function calculateTabWidth(
  ingredients: Ingredient[],
  property: "amount" | "name" | "unit",
): number {
  let maxWidth = 0;
  for (const ingredient of ingredients) {
    let value = "";
    if (property === "amount") {
      const amount = ingredient.amount?.amount;
      value = typeof amount === "number" ? amount.toString() : "";
    } else if (property === "unit") {
      value = ingredient.amount?.unit ?? "";
    } else if (property === "name") {
      value = ingredient.name.join(" ");
    }
    if (value.length > maxWidth) {
      maxWidth = value.length;
    }
  }
  return maxWidth + 1;
}

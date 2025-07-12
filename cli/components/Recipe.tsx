import { Recipe as RecipeDef } from "@stew/lang";
import { Text } from "ink";

export default function Recipe({ recipe }: { recipe: RecipeDef }) {
  return <Text>Name: {recipe.ingredients.map((i) => i.name)}</Text>;
}

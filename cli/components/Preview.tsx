import { Box, Text } from "ink";
import { LangContext } from "../actors/langActor.ts";
import Recipe from "./Recipe.tsx";

export default function Preview({ preview }: { preview: LangContext }) {
  return (
    <Box
      borderColor={preview.error ? "red" : "green"}
    >
      <Text>
        Preview:
      </Text>
      <Text>
        {preview.error?.message}
      </Text>
      <Text>
        {preview.recipe && <Recipe recipe={preview.recipe} />}
      </Text>
      <Text>
        {preview.error && preview.fileContents}
      </Text>
    </Box>
  );
}

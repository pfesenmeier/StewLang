import { Box, Text } from "ink";
import type { LangContext } from "../actors/langMachine.ts";
import Recipe from "./Recipe.tsx";

export default function Preview({ preview }: { preview: LangContext }) {
  return (
    <Box
      borderColor={preview.error ? "red" : "green"}
      flexDirection="column"
    >
      <Text>
        Preview:
      </Text>
      {preview.error && (
        <Text color="red">
          Error: {preview.error?.message}
        </Text>
      )}
      {preview.recipe && <Recipe recipe={preview.recipe} />}
      <Text>
        {preview.error && preview.fileContents}
      </Text>
    </Box>
  );
}

import { Box, Text } from "ink";
import { LangContext } from "../actors/langActor.ts";

export default function Preview({ preview }: { preview: LangContext }) {
  return (
    <Box
      borderColor={preview.error ? "red" : "green"}
    >
      <Text>
        Preview:
      </Text>
      {preview.error?.message}
      {preview.recipe && JSON.stringify(preview.recipe, null, 2)}
    </Box>
  );
}

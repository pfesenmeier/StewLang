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
      <Text>
      {preview.error?.message}
      </Text>
      <Text>
      {preview.recipe && JSON.stringify(preview.recipe, null, 2)}
      </Text>
    </Box>
  );
}

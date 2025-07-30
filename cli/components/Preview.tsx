import { Box, Text } from "ink";
import Recipe from "./Recipe.tsx";
import { PreviewContext } from "../actors/preview/previewActor.ts";

export default function Preview({ preview }: { preview: PreviewContext }) {
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

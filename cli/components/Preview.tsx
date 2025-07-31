import { Box, Text } from "ink";
import Recipe from "./Recipe.tsx";
import { PreviewContext } from "../actors/preview/previewActor.ts";

export default function Preview({ preview }: { preview: PreviewContext }) {
  const title = preview.recipe?.meta?.title ?? "";
  const name = preview.recipe?.meta?.name ?? "";
  return (
    <Box
      borderColor={preview.error ? "red" : "green"}
      flexDirection="column"
    >
      <Box
        marginBottom={1}
      >
        <Text>
          {name && `Name: ${name}`}
          {title && `Title: ${title}`}
        </Text>
      </Box>
      {preview.error && (
        <Text color="red">
          Error: {preview.error?.message}
        </Text>
      )}
      {preview.recipe && (
        <Recipe recipe={preview.recipe} current={preview.currentIngredient} />
      )}
      <Text>
        {preview.error && preview.fileContents}
      </Text>
    </Box>
  );
}

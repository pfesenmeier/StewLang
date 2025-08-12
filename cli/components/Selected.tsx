import { Box, Text } from "ink";
import { SelectedContext } from "../actors/app.ts";

export default function Selected({ context }: { context: SelectedContext }) {
  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor="cyan"
      padding={1}
    >
      <Text>
        Selected:
      </Text>

      {context.selected_files.length > 0
        ? context.selected_files.map((name, index) => (
          <Text key={index} color="blueBright">{name}</Text>
        ))
        : <Text color="red">No files selected</Text>}
    </Box>
  );
}

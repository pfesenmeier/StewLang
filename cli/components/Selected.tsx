import { Box, Text } from "ink";
import { useSelected } from "../hooks/mod.ts";

export default function Selected() {
  const selected = useSelected();

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

      {selected.selected_files.length > 0
        ? selected.selected_files.map((name, index) => (
          <Text key={index} color="blueBright">{name}</Text>
        ))
        : <Text color="red">No files selected</Text>}
    </Box>
  );
}

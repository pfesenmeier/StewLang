import { Box, Text } from "ink";
import { useSelected } from "../hooks/mod.ts";
import { useBase16 } from "../colors/Base16Context.tsx";

export default function Selected() {
  const selected = useSelected();
  const { surfaceColorsIndexed, ...colors } = useBase16();

  return (
    <Box
      flexDirection="column"
      backgroundColor={surfaceColorsIndexed.get(0)}
      padding={1}
      paddingX={2}
    >
      <Text color={colors.base05}>
        Selected:
      </Text>

      {selected.selected_files.length > 0
        ? selected.selected_files.map((name, index) => (
          <Text key={index} color={colors.base0D}>{name}</Text>
        ))
        : <Text color={colors.base08}>No files selected</Text>}
    </Box>
  );
}

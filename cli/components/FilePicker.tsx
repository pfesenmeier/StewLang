import { Box, Text } from "ink";
import { useFileTree } from "../hooks/mod.ts";
import { useBase16 } from "../colors/Base16Context.tsx";

export default function FilePicker() {
  const fileTree = useFileTree();

  const { surfaceColorsIndexed, ...colors } = useBase16();

  return (
    <Box>
      {fileTree.file_lists.map((file, index) => (
        <Box
          flexDirection="column"
          backgroundColor={surfaceColorsIndexed.get(index)}
          padding={1}
          paddingX={2}
          key={index}
        >
          {file.items.map((name, index) => {
            const isCurrent = file.current === index;
            const isSelected = file.selected.includes(index);

            return (
              <Text
                key={name}
                inverse={isCurrent && isSelected}
                backgroundColor={isCurrent
                  ? colors.base01
                  : isSelected
                  ? colors.base07
                  : undefined}
                color={isCurrent
                  ? colors.base0E
                  : isSelected
                  ? colors.base00
                  : colors.base05}
              >
                {name}
              </Text>
            );
          })}
        </Box>
      ))}
    </Box>
  );
}

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
          {file.items.map((name, index) => (
            <Text
              key={name}
              backgroundColor={file.current === index
                ? colors.base01
                : file.selected.includes(index)
                ? colors.base07
                : undefined}
              color={file.current === index
                ? colors.base0E
                : file.selected.includes(index)
                ? colors.base08
                : colors.base05}
            >
              {name}
            </Text>
          ))}
        </Box>
      ))}
    </Box>
  );
}

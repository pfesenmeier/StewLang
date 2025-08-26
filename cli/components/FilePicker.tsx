import { Box, Text } from "ink";
import { useFileTree } from "../hooks/mod.ts";
import { useBase16 } from "../colors/Base16Context.tsx";

export default function FilePicker() {
  const fileTree = useFileTree();

  const { colorsArray } = useBase16();

  return (
    <Box>
      {fileTree.file_lists.map((file, index) => (
        <Box
          flexDirection="column"
          backgroundColor={colorsArray[index]}
          padding={1}
          key={index}
        >
          {file.items.map((name, index) => (
            <Text
              key={name}
              color={file.current === index
                ? "greenBright"
                : file.selected.includes(index)
                ? "yellow"
                : "white"}
            >
              {name}
            </Text>
          ))}
        </Box>
      ))}
    </Box>
  );
}

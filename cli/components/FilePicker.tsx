import { Box, Text } from "ink";
import { Context } from "../actors/fileTreeMachine.ts";

export default function FilePicker(
  { context }: { context: Context },
) {
  return (
    <>
      <Box>
        {context.file_lists.map((file, index) => (
          <Box
            flexDirection="column"
            borderStyle="round"
            borderColor="green"
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
    </>
  );
}

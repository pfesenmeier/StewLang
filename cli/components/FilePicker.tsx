import { Box, Text } from "ink";
import { useApp } from "../hooks/useApp.ts";

export default function FilePicker({ rootDir }: { rootDir: string }) {
  const { fileTree: context, app: appContext } = useApp(rootDir);

  return (
    <>
      <Box>
        <Text>
          Selected:
        </Text>

        {appContext.selected_files.length > 0
          ? context.selected_files.map((name, index) => (
            <Text key={index} color="blue">{name}</Text>
          ))
          : <Text color="red">No files selected</Text>}
      </Box>
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
                color={file.current === index ? "blue" : undefined}
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

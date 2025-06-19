import { Box, Text } from "ink";
import { useApp } from "../hooks/useApp.ts";

export default function FilePicker({ rootDir }: { rootDir: string }) {
  const context = useApp(rootDir)

  return (
    <Box>
      {context.file_lists.map((file, index) => 
      <Box
      flexDirection="column"
      borderStyle="round"
      borderColor="green"
      padding={1}
      key={index}
    >
      {file.items.map((name, index) => (
        <Text key={name} color={file.current === index 
              ? 'blue' : undefined}>{name}</Text>
      ))}
    </Box>)}
    </Box>
    )
}

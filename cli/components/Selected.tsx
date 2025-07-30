import { Box, Text } from "ink";
import type { AppContext } from "../actors/appActor.ts";

export default function Selected({ appContext }: { appContext: AppContext }) {
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

      {appContext.selected_files.length > 0
        ? appContext.selected_files.map((name, index) => (
          <Text key={index} color="blueBright">{name}</Text>
        ))
        : <Text color="red">No files selected</Text>}
    </Box>
  );
}

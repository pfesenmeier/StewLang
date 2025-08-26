import { Box, Text } from "ink";
import { useSnapshot } from "../hooks/mod.ts";

export function MachineSnapshot() {
  const snapshot = useSnapshot();
  return (
    <Box flexDirection="column" justifyContent="center" width="full">
      <Text backgroundColor="red">Machine status</Text>
      <Text color="red" bold>Status</Text>
      <Text>{snapshot.status}</Text>
      <Text bold color="red">Value:</Text>
      <Text>{JSON.stringify(snapshot.value, undefined, 2)}</Text>
    </Box>
  );
}

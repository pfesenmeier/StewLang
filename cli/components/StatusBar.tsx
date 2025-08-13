import { Box, Text } from "ink";
import { useAppState } from "../hooks/mod.ts";

export default function StatusBar() {
  const { preview, browsing, selecting } = useAppState();
  let text = "";
  if (preview) text = "PREVIEW";
  if (browsing) text = "BROWSING";
  if (selecting) text = "SELECTING";

  return (
    <Box backgroundColor="black">
      <Text>-- {text} --</Text>
    </Box>
  );
}

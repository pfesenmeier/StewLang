import { Box, Text } from "ink";
import { useAppState } from "../hooks/mod.ts";

export default function StatusBar() {
  const { preview, browsing, selecting } = useAppState();

  const text = preview 
    ? "PREVIEW"
    : browsing 
    ? "BROWSING"
    : selecting 
    ? "SELECTING"
    : "WHOOPS"; 

  return (
    <Box backgroundColor="black">
      <Text color="white">-- {text} --</Text>
    </Box>
  );
}

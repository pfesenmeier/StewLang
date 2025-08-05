import { Box, Text } from "ink";
import { useBase16 } from "../colors/Base16Context.tsx";

export default function ColorPreview() {
  const colors = useBase16();
  return (
    <Box flexDirection="column">
      {Object.entries(colors).map(([key, value]) => {
        if (typeof value === "string") {
          const text = `${key}: ${value}`;
          return <Text key={key} color={value}>{text}</Text>;
        }
      })}
    </Box>
  );
}

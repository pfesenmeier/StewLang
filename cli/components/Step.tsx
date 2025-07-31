import { Step } from "@stew/lang";
import { useBase16 } from "../colors/Base16Context.tsx";
import { Box, Text } from "ink";

export default function Steps({ step, index }: { step: Step; index?: number }) {
  const theme = useBase16();
  return (
    <Box>
      <Text color={theme.base0A}>
        {`${index ? index + "." : "-"} `}
      </Text>
      <Text color={theme.base05}>
        {step.text.join(" ")}
      </Text>
    </Box>
  );
}

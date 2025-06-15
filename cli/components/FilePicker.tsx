import { Box, Text, useInput } from "ink";
import { useState } from "react";

export default function FilePicker({ rootDir }: { rootDir: string }) {
  const files = [];
  for (const file of Deno.readDirSync(rootDir)) {
    files.push(file);
  }

  const [current, setCurrent] = useState(0);
  const [selected, select] = useState(-1)
  useInput((input, key) => {
    if (input === "q") {
      Deno.exit(0);
    } else if (key.downArrow && current < files.length - 1) {
      setCurrent(current + 1);
    } else if (key.upArrow && current > 0) {
      setCurrent(current - 1);
    } else if (input === " ") {
      select(current)
    } else {
      console.log('input', input)
    }
  });

  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor="green"
      padding={1}
    >
      {files.map(({ name }, index) => (
        <Text key={name} color={selected === index ? 'green' : undefined}>{current === index && "* "}{name}</Text>
      ))}
    </Box>
  );
}

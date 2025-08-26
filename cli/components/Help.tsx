import { Box, Text } from "ink";

const keys = [{
  key: "?",
  does: "Show help",
}, {
  key: "q",
  does: "Quit",
}, {
  key: "hjkl",
  does: "navigate",
}, {
  key: "arrow keys",
  does: "navigate",
}, {
  key: "j",
  does: "Go down",
}, {
  key: "k",
  does: "Go up",
}, {
  key: "<space>",
  does: "Select file",
}, {
  key: "enter",
  does: "Confirm selection",
}, {
  key: "tab",
  does: "Next view",
}, {
  key: "shift + tab",
  does: "Previous view",
}];

export default function Help() {
  return (
    <Box flexDirection="column">
      <Text color="green">Help</Text>
      <Text color="green">Press any key to go back</Text>
      {keys.map((item, index) => (
        <Text key={index}>
          <Text color="yellow">{item.key}</Text> - {item.does}
        </Text>
      ))}
    </Box>
  );
}

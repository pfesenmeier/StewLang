import Gradient from "ink-gradient";
import process from "node:process";
import BigText from "ink-big-text";
import { Box, Text } from "ink";

export default function Welcome() {
  return (
    <Box
      flexDirection="column"
      height={process.stdout.rows}
      justifyContent="center"
      alignItems="center"
    >
      <Box>
        <Gradient name="morning">
          <BigText text="StewLang" />
        </Gradient>
      </Box>
      <Text>[ Press any key to continue ]</Text>
    </Box>
  );
}

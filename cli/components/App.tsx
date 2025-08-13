import { Box } from "ink";
import FilePicker from "./FilePicker.tsx";
import Selected from "./Selected.tsx";
import Preview from "./Preview.tsx";
import Welcome from "./Welcome.tsx";
import { useStdoutDimensions } from "../hooks/useStdoutDimensions.ts";
import { Base16Provider } from "../colors/Base16Context.tsx";
import ColorPreview from "./ColorPreview.tsx";
import { useWelcome } from "../hooks/mod.ts";
import { useKeypressListener } from "../hooks/useKeypressListener.ts";

export default function App() {
  useKeypressListener();
  const welcomeIsOpen = useWelcome();

  const { columns } = useStdoutDimensions();

  return (
    <Base16Provider>
      <Box width={columns} flexDirection="column">
        {welcomeIsOpen ? <Welcome /> : (
          <Box flexDirection="column">
            {/* <ColorPreview /> */}
            <Selected />
            <FilePicker />
            <Preview />
          </Box>
        )}
      </Box>
    </Base16Provider>
  );
}

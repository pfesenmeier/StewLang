import { Box } from "ink";
import FilePicker from "./FilePicker.tsx";
import Selected from "./Selected.tsx";
import Preview from "./Preview.tsx";
import Welcome from "./Welcome.tsx";
import { useStdoutDimensions } from "../hooks/useStdoutDimensions.ts";
import { Base16Provider } from "../colors/Base16Context.tsx";
import ColorPreview from "./ColorPreview.tsx";
import { useAppState } from "../hooks/mod.ts";
import { useKeypressListener } from "../hooks/useKeypressListener.ts";
import StatusBar from "./StatusBar.tsx";
import Help from "./Help.tsx";

export default function App() {
  useKeypressListener();
  const { welcome, selecting, browsing, preview, help } = useAppState();

  const { columns } = useStdoutDimensions();

  return (
    <Base16Provider>
      <Box width={columns} flexDirection="column">
        {welcome && <Welcome />}
        {selecting && <Selected />}
        {browsing && <FilePicker />}
        {preview && <Preview />}
        {help && <Help />}
        {!welcome && <StatusBar />}
      </Box>
    </Base16Provider>
  );
}

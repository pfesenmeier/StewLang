import { Box } from "ink";
import FilePicker from "./FilePicker.tsx";
import Selected from "./Selected.tsx";
import Preview from "./Preview.tsx";
import Welcome from "./Welcome.tsx";
import { useStdoutDimensions } from "../hooks/useStdoutDimensions.ts";
import ColorPreview from "./ColorPreview.tsx";
import { useAppState } from "../hooks/mod.ts";
import { useKeypressListener } from "../hooks/useKeypressListener.ts";
import StatusBar from "./StatusBar.tsx";
import Help from "./Help.tsx";
import { MachineSnapshot } from "./MachineSnapshot.tsx";

export default function App({ debug }: { debug: boolean }) {
  useKeypressListener();
  const { welcome, selecting, browsing, preview, help } = useAppState();

  const { columns, rows } = useStdoutDimensions();

  return (
    <Box
      width={columns}
      height={rows - 1}
      flexDirection="column"
    >
      {!welcome && <StatusBar />}
      {welcome && <Welcome />}
      {selecting && <Selected />}
      {browsing && <FilePicker />}
      {preview && <Preview />}
      {help && <Help />}
      {debug && <MachineSnapshot />}
    </Box>
  );
}

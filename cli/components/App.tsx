import { Box } from "ink";
import FilePicker from "./FilePicker.tsx";
import Selected from "./Selected.tsx";
import Preview from "./Preview.tsx";
import Welcome from "./Welcome.tsx";
import { useStdoutDimensions } from "../hooks/useStdoutDimensions.ts";
import { Base16Provider } from "../colors/Base16Context.tsx";
import ColorPreview from "./ColorPreview.tsx";
import { useApp } from "../hooks/useApp.ts";

export default function App({ rootDir }: { rootDir: string }) {
  const { fileTree: context, selected, preview, welcomeIsOpen } = useApp(
    rootDir,
  );
  const { columns } = useStdoutDimensions();

  return (
    <Base16Provider>
      <Box width={columns} flexDirection="column">
        {welcomeIsOpen ? <Welcome /> : (
          <Box flexDirection="column">
            <ColorPreview />
            <Selected context={selected} />
            <FilePicker context={context} />
            <Preview preview={preview} />
          </Box>
        )}
      </Box>
    </Base16Provider>
  );
}

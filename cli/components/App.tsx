import { Box } from "ink";
import FilePicker from "./FilePicker.tsx";
import { useApp } from "../hooks/useApp.ts";
import Selected from "./Selected.tsx";
import Preview from "./Preview.tsx";
import Welcome from "./Welcome.tsx";
import { useStdoutDimensions } from "../hooks/useStdoutDimensions.ts";

export default function App({ rootDir }: { rootDir: string }) {
  const { fileTree: context, app: appContext, preview, welcomeIsOpen } = useApp(
    rootDir,
  );
  const { columns } = useStdoutDimensions();

  return (
    <Box width={columns} flexDirection="column">
      {welcomeIsOpen ? <Welcome /> : (
        <Box flexDirection="column">
          <Selected appContext={appContext} />
          <FilePicker context={context} />
          <Preview preview={preview} />
        </Box>
      )}
    </Box>
  );
}

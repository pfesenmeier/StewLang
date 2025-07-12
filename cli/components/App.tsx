import { Box } from "ink";
import FilePicker from "./FilePicker.tsx";
import { useApp } from "../hooks/useApp.ts";
import Selected from "./Selected.tsx";
import Preview from "./Preview.tsx";

export default function App({ rootDir }: { rootDir: string }) {
  const { fileTree: context, app: appContext, preview } = useApp(rootDir);
  return (
    <Box flexDirection="column">
      <Selected appContext={appContext} />
      <FilePicker context={context} />
      <Preview preview={preview} />
    </Box>
  );
}

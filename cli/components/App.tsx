import { Box } from "ink";
import FilePicker from "./FilePicker.tsx";
import { useApp } from "../hooks/useApp.ts";

export default function App({ rootDir }: { rootDir: string }) {
  const { fileTree: context, app: appContext, preview } = useApp(rootDir);
  return (
    <Box>
      <FilePicker context={context} appContext={appContext} />
      <Box
        borderColor={preview.error ? "red" : "green"}
      >
        {preview.error?.message}
        {preview.recipe && JSON.stringify(preview.recipe, null, 2)}
      </Box>
    </Box>
  );
}

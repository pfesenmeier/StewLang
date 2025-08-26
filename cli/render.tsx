import { render as renderInk } from "ink";
import App from "./components/App.tsx";
import { AppProvider } from "./context/AppContext.tsx";
import { Base16Provider } from "./colors/Base16Context.tsx";

export function render(
  { rootDir, debug }: { rootDir: string; debug: boolean },
) {
  renderInk(
    <AppProvider cwd={rootDir}>
      <Base16Provider>
        <App debug={debug} />
      </Base16Provider>
    </AppProvider>,
  );
}

import { render as renderInk } from "ink";
import App from "./components/App.tsx";
import { AppProvider } from "./context/AppContext.tsx";
import { Base16Provider } from "./colors/Base16Context.tsx";

export function render(rootDir: string) {
  renderInk(
    <AppProvider cwd={rootDir}>
      <Base16Provider>
      <App />
      </Base16Provider>
    </AppProvider>,
  );
}

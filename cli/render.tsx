import { render as renderInk } from "ink";
import App from "./components/App.tsx";
import { AppProvider } from "./context/AppContext.tsx";

export function render(rootDir: string) {
  renderInk(
    <AppProvider cwd={rootDir}>
      <App />
    </AppProvider>,
  );
}

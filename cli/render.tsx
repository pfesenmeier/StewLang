import { render as renderInk } from "ink";
import App from "./components/App.tsx";

export function render(rootDir: string) {
  renderInk(<App rootDir={rootDir}></App>);
}

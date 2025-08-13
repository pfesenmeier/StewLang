import { useInput } from "ink";
import { useSend } from "./mod.ts";

export function useKeypressListener() {
  const send = useSend();

  useInput((input, key) => {
    if (key.return) {
      send({ type: "enter" });
    } else if (input === "q") {
      Deno.exit(0);
    } else if (key.downArrow || input === "j") {
      send({ type: "down" });
    } else if (key.upArrow || input === "k") {
      send({ type: "up" });
    } else if (key.leftArrow || input === "h") {
      send({ type: "left" });
    } else if (key.rightArrow || input === "l") {
      send({ type: "right" });
    } else if (input === " ") {
      send({ type: "space" });
    } else if (key.tab && key.shift) {
      send({ type: "shiftab" });
    } else if (key.tab) {
      send({ type: "tab" });
    }
  });
}

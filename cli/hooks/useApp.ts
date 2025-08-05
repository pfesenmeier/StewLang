import { useActor, useSelector } from "@xstate/react";
import { useInput } from "ink";
import { getActor } from "../actors/system.ts";
import { rootActor } from "../actors/rootActor.ts";

export function useApp(cwd: string) {
  const [_, __, { system }] = useActor(rootActor, {
    input: {
      cwd,
    },
  });

  const fileTreeRef = getActor(system, "fileTree");
  const fileTreeContext = useSelector(fileTreeRef, ({ context }) => context);

  const previewContext = useSelector(
    getActor(system, "preview"),
    ({ context }) => context,
  );

  const appRef = getActor(system, "app")
  const appContext = useSelector(
    appRef,
    ({ context }) => context,
  );

  const welcomeIsOpen = useSelector(
    appRef,
    (machine) => machine?.matches("welcome"),
  );

  useInput((input, key) => {
    const send = appRef.send;

    if (key.return) {
      send({ type: "enter" })
    } else if (input === "q") {
      Deno.exit(0);
    } else if (key.downArrow) {
      send({ type: "down" });
    } else if (key.upArrow) {
      send({ type: "up" });
    } else if (key.leftArrow) {
      send({ type: "left" });
    } else if (key.rightArrow) {
      send({ type: "right" });
    } else if (input === " ") {
      send({ type: "space" });
      // } else if (key.tab && key.shift) {
      //   send({ type: "focusPrevious" });
      // } else if (key.tab) {
      //   send({ type: "focusNext" });
    }
  });

  return {
    fileTree: fileTreeContext,
    app: appContext,
    preview: previewContext,
    welcomeIsOpen,
  };
}

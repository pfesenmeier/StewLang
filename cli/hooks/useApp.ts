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

  const appContext = useSelector(
    getActor(system, "app"),
    ({ context }) => context,
  );

  const welcomeRef = getActor(system, "welcome");
  const welcomeIsOpen = useSelector(
    welcomeRef,
    (machine) => machine?.status === "active",
  );

  // langRef.subscribe((snapshot) => {
  //   console.log(snapshot.value)
  // })

  useInput((input, key) => {
    const sendFileTree = fileTreeRef.send;
    // TODO welcomeRef is unique since will be torn down
    const sendWelcome = welcomeRef?.send ?? function () {};

    if (welcomeIsOpen) {
      sendWelcome({ type: "close" });
    } else if (input === "q") {
      Deno.exit(0);
    } else if (key.downArrow) {
      sendFileTree({ type: "next" });
    } else if (key.upArrow) {
      sendFileTree({ type: "previous" });
    } else if (key.leftArrow) {
      sendFileTree({ type: "up" });
    } else if (key.rightArrow) {
      sendFileTree({ type: "in" });
    } else if (input === " ") {
      sendFileTree({ type: "toggle" });
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

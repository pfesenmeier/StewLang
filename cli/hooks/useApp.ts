import { useMachine } from "@xstate/react";
import { useInput } from "ink";
import { fileTreeMachine } from "../actors/fileTreeMachine.ts";
import { appMachine } from "../actors/appMachine.ts";
export function useApp(cwd: string) {
  const [snapshot, _send, appRef] = useMachine(appMachine, {
    input: {
      cwd,
    },
  });

  const [fileTreeSnapshot, send] = useMachine(fileTreeMachine, {
    input: {
      appRef,
      cwd,
    },
  });

  useInput((input, key) => {
    if (input === "q") {
      Deno.exit(0);
    } else if (key.downArrow) {
      send({ type: "next" });
    } else if (key.upArrow) {
      send({ type: "previous" });
    } else if (key.leftArrow) {
      send({ type: "up" });
    } else if (key.rightArrow) {
      send({ type: "in" });
    } else if (input === " ") {
      send({ type: "toggle" });
    }
  });

  return {
    fileTree: fileTreeSnapshot.context,
    app: snapshot.context,
  };
}

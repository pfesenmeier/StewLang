import { useMachine, useSelector } from "@xstate/react";
import { useInput } from "ink";
import type { FileTreeMachine } from "../actors/fileTreeMachine.ts";
import { appMachine } from "../actors/appMachine.ts";
import { langActor } from "../actors/langActor.ts";
import { ActorRefFrom } from "xstate";

export function useApp(cwd: string) {
  const [snapshot, _send, appRef] = useMachine(appMachine, {
    input: {
      cwd,
    },
  });

  const fileTreeRef = appRef.system.get("fileTree") as ActorRefFrom<
    FileTreeMachine
  >;
  const fileTreeContext = useSelector(fileTreeRef, ({ context }) => context);

  const langRef = appRef.system.get("lang") as ActorRefFrom<typeof langActor>;
  const langContext = useSelector(langRef, ({ context }) => context);

  // langRef.subscribe((snapshot) => {
  //   console.log(snapshot.value)
  // })

  useInput((input, key) => {
    const send = fileTreeRef.send;
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
    fileTree: fileTreeContext,
    app: snapshot.context,
    preview: langContext,
  };
}

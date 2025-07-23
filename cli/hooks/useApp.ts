import { useMachine, useSelector } from "@xstate/react";
import { useInput } from "ink";
import type { FileTreeMachine } from "../actors/fileTree/fileTreeMachine.ts";
import type { LangMachine } from "../actors/lang/langMachine.ts";
import { appMachine } from "../actors/appMachine.ts";
import { ActorRefFrom } from "xstate";
import { WelcomeMachine } from "../actors/welcomeMachineLogic.ts";

export function useApp(cwd: string) {
  const [snapshot, _, appRef] = useMachine(appMachine, {
    input: {
      cwd,
    },
  });

  const fileTreeRef = appRef.system.get("fileTree") as ActorRefFrom<
    FileTreeMachine
  >;
  const fileTreeContext = useSelector(fileTreeRef, ({ context }) => context);

  const langRef = appRef.system.get("lang") as ActorRefFrom<LangMachine>;
  const langContext = useSelector(langRef, ({ context }) => context);

  const welcomeRef = appRef.system.get("welcome") as ActorRefFrom<
    WelcomeMachine
  >;
  const welcomeIsOpen = useSelector(
    welcomeRef,
    (machine) => machine?.status === "active",
  );
  const closeWelcome = () => welcomeRef.send({ type: "close" });

  // langRef.subscribe((snapshot) => {
  //   console.log(snapshot.value)
  // })

  useInput((input, key) => {
    const send = fileTreeRef.send;

    if (welcomeIsOpen) {
      closeWelcome();
    } else if (input === "q") {
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
    welcomeIsOpen,
  };
}

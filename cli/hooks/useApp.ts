import { useMachine, useSelector } from "@xstate/react";
import { useInput } from "ink";
import { appMachine } from "../actors/appMachine.ts";
import { getActor } from "../actors/system.ts";

export function useApp(cwd: string) {
  const [snapshot, _, appRef] = useMachine(appMachine, {
    input: {
      cwd,
    },
  });

  const system = appRef.system;

  const fileTreeRef = getActor(system, "fileTree");
  const fileTreeContext = useSelector(fileTreeRef, ({ context }) => context);

  const langRef = getActor(system, "lang");
  const langContext = useSelector(langRef, ({ context }) => context);

  const welcomeRef = getActor(system, "welcome");
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
      // } else if (key.tab && key.shift) {
      //   send({ type: "focusPrevious" });
      // } else if (key.tab) {
      //   send({ type: "focusNext" });
    }
  });

  return {
    fileTree: fileTreeContext,
    app: snapshot.context,
    preview: langContext,
    welcomeIsOpen,
  };
}

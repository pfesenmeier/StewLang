import { useActor } from "@xstate/react";
import { app } from "../actors/app.ts";
import { useKeypressListener } from "./useKeypressListener.ts";

export function useApp(cwd: string) {
  const [snapshot, send] = useActor(app, {
    input: {
      cwd,
    },
  });

  useKeypressListener(send);

  // useEffect(() => {
  //   const subscription = ref.subscribe((snapshot) => {
  //     console.log("state", snapshot.value)
  //   });
  //
  //   return subscription.unsubscribe;
  // }, [ref]);

  return {
    ...snapshot.context,
    welcomeIsOpen: snapshot.matches("welcome"),
  };
}

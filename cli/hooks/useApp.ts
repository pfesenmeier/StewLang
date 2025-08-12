import { useActor } from "@xstate/react";
import { app } from "../actors/app.ts";
import { useKeypressListener } from "./useKeypressListener.ts";

export function useApp(cwd: string) {
  const [snapshot, send] = useActor(app, {
    input: {
      cwd
    }
  })

  useKeypressListener(send)

  return {
    ...snapshot.context,
    welcomeIsOpen: snapshot.matches("welcome")
  }
}


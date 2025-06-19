import { useMachine } from '@xstate/react'
import { useInput } from 'ink'
import { appMachine } from "../actors/fileTreeActor.ts";
export function useApp(cwd: string) {
  const [snapshot, send] = useMachine(appMachine, {
    input: {
      cwd
    }
  })

  useInput((input, key) => {
    if (input === "q") {
      Deno.exit(0);
    } else if (key.downArrow) {
      send({ type: 'next' })
    } else if (key.upArrow) {
      send({ type: 'previous' })
    } else if (key.leftArrow) {
      send({ type: 'up' })
    } else {
      send({ type: 'in' })
    }
  });

  return snapshot.context
}

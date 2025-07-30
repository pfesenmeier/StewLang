import { assign, setup } from "xstate";
import { welcomeActor } from "./welcomeActor.ts";

export const appActor = setup({
  actors: {
    welcome: welcomeActor,
  },
  types: {
    context: {} as AppContext,
    events: {} as AppEvents,
  },
}).createMachine({
  context: { selected_files: [] },
  initial: "welcome",
  states: {
    welcome: {
      invoke: {
        src: "welcome",
        systemId: "welcome",
        onDone: "select_recipe",
      },
    },
    select_recipe: {
      on: {
        next: {
          target: "order_recipe",
        },
        SelectionUpdateEvent: {
          actions: assign({
            selected_files: ({ event }) => event.data,
          }),
        },
      },
    },
    order_recipe: {},
  },
});

type AppEvents =
  | {
    type: "SelectionUpdateEvent";
    data: string[];
  }
  | { type: "next" };

export type AppContext = { selected_files: string[] };

import { ActorRef, assign, setup, Snapshot } from "xstate";
import { fileTreeMachine } from "./fileTree/fileTreeMachine.ts";
import { welcomeMachineLogic } from "./welcomeMachineLogic.ts";

export type SelectionUpdateEvent = {
  type: "SelectionUpdateEvent";
  data: string[];
};

type Events = SelectionUpdateEvent | { type: "next" };

export type AppActorRef = ActorRef<Snapshot<unknown>, SelectionUpdateEvent>;

export type AppContext = { cwd: string; selected_files: string[] };

export const appMachine = setup({
  actors: {
    fileTree: fileTreeMachine,
    welcome: welcomeMachineLogic,
  },
  types: {
    input: {} as { cwd: string },
    context: {} as AppContext,
    events: {} as Events,
  },
}).createMachine({
  invoke: {
    src: "fileTree",
    systemId: "fileTree",
    input: ({ self, context: { cwd } }) => ({ appRef: self, cwd }),
  },
  context: ({ input }) => ({ cwd: input.cwd, selected_files: [] }),
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

export type AppMachine = typeof appMachine;

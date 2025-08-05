import { assign, sendTo, setup } from "xstate";
import { getActor } from "./system.ts";
import { KeyPressEvents } from "./keyPressEvents.ts";

export const appActor = setup({
  types: {
    context: {} as AppContext,
    events: {} as AppEvents,
  },
}).createMachine({
  context: { selected_files: [] },
  initial: "welcome",
  states: {
    welcome: {
      on: {
        space: "select_recipe",
      },
    },
    select_recipe: {
      initial: "browse",
      states: {
        browse: {
          on: {
            left: {
              actions: sendTo(({ system }) => getActor(system, "fileTree"), {
                type: "up",
              }),
            },
            right: {
              actions: sendTo(({ system }) => getActor(system, "fileTree"), {
                type: "in",
              }),
            },
            up: {
              actions: sendTo(({ system }) => getActor(system, "fileTree"), {
                type: "previous",
              }),
            },
            down: {
              actions: sendTo(({ system }) => getActor(system, "fileTree"), {
                type: "next",
              }),
            },
            space: {
              actions: sendTo(({ system }) => getActor(system, "fileTree"), {
                type: "toggle",
              }),
            },
            tab: "preview",
            shiftab: "selected"
          },
        },
        preview: {
          on: {
            tab: "selected",
            shiftab: "browse"
          }
        },
        selected: {
          on: {
            tab: "browse",
            shiftab: "preview"
          }
        },
        help: {},
      },
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

export type AppEvents =
  | {
    type: "SelectionUpdateEvent";
    data: string[];
  }
  | { type: "next" }
  | KeyPressEvents;

export type AppContext = { selected_files: string[] };

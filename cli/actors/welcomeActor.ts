import { setup } from "xstate";

export type CloseEvent = { type: "close" };

export const welcomeActor = setup({
  types: {
    events: {} as CloseEvent,
  },
}).createMachine({
  initial: "open",
  states: {
    open: {
      on: {
        close: "closed",
      },
    },
    closed: {
      type: "final",
    },
  },
});

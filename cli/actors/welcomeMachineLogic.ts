import { setup } from "xstate";

export type CloseEvent = { type: "close" };

export type WelcomeMachine = typeof welcomeMachineLogic;

export const welcomeMachineLogic = setup({
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

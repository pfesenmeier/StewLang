import { ActorRef, assign, setup, Snapshot } from "xstate";
import { fileTreeMachine } from "./fileTreeMachine.ts";

// subscribe to file tree... emit events?
// file tree invokes events on app machine?

// one suggested pattern...
// sendTo... https://stately.ai/docs/actions#send-parent-action
// sends events to parent
// difference between 'observable'?
//
// not sure interop between fromObservable()... createMachine() calls
// send parent seems best for createMachine() api
//
//
// so... send events to fileTreeMachine... it sends an event to appMachine that selection was removed or
// downside: 'selection' stored in two places
// upside: appMachine will store it in absolute paths, fileTreeMachine will store it in its file_lists[]
//
// shit... so once leave a directory... how to store the selected file?
// will have to iterate over selected to see if applies
// could store inside fileTreeMachine or invoke parent??

export type SelectionUpdateEvent = {
  type: "SelectionUpdateEvent";
  data: string[];
};

type Events = SelectionUpdateEvent | { type: "next" };

export type AppActor = ActorRef<Snapshot<unknown>, SelectionUpdateEvent>;

export const appMachine = setup({
  actors: {
    fileTree: fileTreeMachine,
  },
  types: {
    input: {} as { cwd: string },
    context: {} as { cwd: string; selected_files: string[] },
    events: {} as Events,
  },
}).createMachine({
  context: ({ input }) => ({ cwd: input.cwd, selected_files: [] }),
  initial: "select_recipe",
  states: {
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

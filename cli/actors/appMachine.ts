import { ActorRef, assign, setup, Snapshot } from "xstate";
import { fileTreeMachine } from "./fileTreeMachine.ts";

// one suggested pattern...
// sendTo... https://stately.ai/docs/actions#send-parent-action
// sends events to parent
// difference between 'observable'?
//
// not sure interop between fromObservable()... createMachine() calls
// send parent seems best for createMachine() api
//
// how to implement update preview updates?
//
// |-----------------|
// |    appMachine   |
// |-----------------|
//
// appMachine subscribes to fileTreeMachine
// refactor fileTreeMachine to broadcast to all subscribers?
//
// |-----------------|             |-----------|
// | fileTreeMachine |             \ langActor |
// |-----------------|             \ --------|
//
// langActor... subscribes to fileTreeMachine's "CurrentItem" events
// fileTree...  allow an invalid item to be selected... no
// so fileTreeMachine invokes langActor to see if valid
// just call it renderActor?
//
// so we've prevented invalid selections making to next sections in the file picker
// only sent events if .sw (guard)
//
// does fileTreeMachine spawn a preview?

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

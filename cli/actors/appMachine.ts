import { setup } from "xstate";

type Events = {
  type: 'next'
}

// subscribe to file tree... emit events?
// file tree invokes events on app machine?

// one suggested pattern...
// sendTo... https://stately.ai/docs/actions#send-parent-action
// sends events to parent
// difference between 'observable'?
//
// not sure interop between fromObservable()... createMachine() calls
// send parent seems best for createMachine() api

export const appMachine = setup({
  actors: {
    files:
  }
}).createMachine({
  states: {
    select_recipe: {
      on: {
        next: {
          target: 'order_recipe'
        }
      }
    },
    order_recipe: {}
  }
})

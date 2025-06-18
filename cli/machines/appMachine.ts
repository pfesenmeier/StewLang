import { assign, fromPromise, setup } from "xstate";
import {} from "@std:path";
import { Recipe, StewLang } from "@stew/lang";
import { parse } from "@std/path";

// file system actor...
// which can be invoked by the app actor?

// seperate loading states...
// 'listing'  | 'selecting' | 'previewing'

// move preview to an (async) action, fire and forget
// move setup invocation to a chain... each spawns the next one
// add global error subscriber
//actor.subscribe({
//   error: (err) => {
//     console.error(err);
//   },
// });



export const appMachine = setup({
  types: {
    context: {} as Context,
    events: {} as Events,
    input: {} as { cwd: string },
  },
  actors: {
    // preview: previewActor,
    ls: lsActor,
  },
}).createMachine({
  context: ({ input: { cwd } }) => ({
    select_files: [],
    current_item: null,
    current_working_dir: cwd ?? ".",
    current_preview: null,
    file_lists: [],
    max_list: 3,
  }),
  initial: "loading",
  // invoke ls
  // actions...
  states: {
    'main.select': {
    },
    'init.list': {
      invoke: {
        src: "ls",
        input: ({ context }) => {
          return {
            folder: context.current_working_dir
          }
        },
        onDone: {
          actions: assign({
            file_lists: ({ event  }) => [event.output],
            current_item: ({ event }) => event.output.at(0) ?? null
          })
        }
      }
    }
  },
  // entry: [
  //   assign(({ context }) => {
  //     if (!context.current_item) return {}
  //
  //     return {
  //       current_preview: preview(context.current_item),
  //     };
  //   }),
  // ],
});

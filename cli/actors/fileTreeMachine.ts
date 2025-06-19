import { assign, setup, raise } from "xstate";
import { Recipe } from "../../lang/mod.ts";
import { lsActor } from "./lsActor.ts";
import { joinPath, splitPath } from "./helpers.ts";

export type Context = {
  // absolute path
  base_path: string[];
  // could be null if folder is empty
  current_item: string | null;
  // absolute paths
  select_files: string[];
  // could be null if folder is empty
  current_preview: Recipe | Error | null;
  file_lists: { items: string[]; current: number | null }[];
  max_list: 3;
};

export type Events =
  | { type: "previous" }
  | { type: "next" }
  | { type: "up" }
  | { type: "in" }
  | { type: "up_reload" }
  // TODO
  | { type: "toggle" };

export const fileTreeMachine = setup({
  types: {
    context: {} as Context,
    events: {} as Events,
    input: {} as { cwd: string },
  },
  actors: {
    // TODO -- another loading state
    // preview: previewActor,
    ls: lsActor,
  },
}).createMachine({
  context: ({ input: { cwd } }) => ({
    select_files: [],
    current_item: null,
    base_path: splitPath(cwd ?? "."),
    current_preview: null,
    file_lists: [],
    max_list: 3,
  }),
  initial: "loading",
  states: {
    "loading": {
      invoke: {
        src: "ls",
        input: ({ context }) => {
          if (context.file_lists.length === 0) {
            return { folder: joinPath(context.base_path) };
          }

          // TODO guard
          const selected = context.file_lists.map(({ items, current }) => {
            if (current === null) {
              throw new Error("tried to go in when enter is null");
            }
            const result = items.at(current);

            if (!result) throw new Error("current not set correctly");

            return result;
          });

          return { folder: joinPath([...context.base_path, ...selected]) };
        },
        onDone: {
          actions: assign({
            file_lists: ({ context, event }) =>
              context.file_lists.concat({
                items: event.output,
                current: event.output.length > 0 ? 0 : null,
              }),
          }),
          target: "ready",
        },
      },
    },
    "ready": {
      on: {
        next: {
          actions: assign({
            file_lists: ({ context }) => {
              const result = [...context.file_lists];
              const last = result.pop();

              if (!last) return context.file_lists;
              if (last.current === null) return context.file_lists;

              if (last.current < last.items.length - 1) {
                last.current++;
              }

              return result.concat(last);
            },
          }),
        },
        previous: {
          actions: assign({
            file_lists: ({ context }) => {
              const result = [...context.file_lists];
              const last = result.pop();

              if (!last) return context.file_lists;
              if (last.current === null) return context.file_lists;

              if (last.current > 0) {
                last.current--;
              }

              return result.concat(last);
            },
          }),
        },
        up: {
          actions: [assign(({ context }) => {
            const list_length = context.file_lists.length;

            if (context.base_path.length === 1 && list_length === 1) {
              return {};
            } else if (list_length === 1) {
              return {
                file_lists: context.file_lists.slice(0, -1),
                base_path: context.base_path.slice(0, -1),
              };
            }

            return {
              file_lists: context.file_lists.slice(0, -1),
            };
          }),
            raise({ type: 'up_reload' })
          ]
        },
        up_reload: [ {
          guard: ({ context }) => context.file_lists.length === 0, 
          target: "loading",
          },
          { target: "ready" }
        ],
        in: 'loading',
      },
    },
  },
});


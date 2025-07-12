import { ActorRef, assign, raise, sendTo, setup, Snapshot } from "xstate";
import { Recipe } from "../../lang/mod.ts";
import { lsActor } from "./lsActor.ts";
import type { AppActor } from "./appMachine.ts";
import {
  joinPath,
  loadSelected,
  splitPath,
  toggleSelected,
  tryGetCurrentItem,
} from "./helpers.ts";
import { langActor } from "./langActor.ts";

export type FileTreeActor = ActorRef<
  Snapshot<unknown>,
  Events | FileIsValidEvent
>;

export type Context = {
  // absolute path
  base_path: string[];
  current_is_valid: boolean;
  // absolute paths
  selected_files: string[];
  // could be null if folder is empty
  current_preview: Recipe | Error | null;
  file_lists: { items: string[]; current: number | null; selected: number[] }[];
  max_list: 3;
  appRef: AppActor;
};

export type FileIsValidEvent = {
  type: "FileIsValidEvent";
  data: boolean;
};

export type Events =
  | { type: "previous" }
  | { type: "next" }
  | { type: "up" }
  | { type: "in" }
  | { type: "up_reload" }
  | { type: "toggle" }
  | FileIsValidEvent;

export const fileTreeMachine = setup({
  types: {
    context: {} as Context,
    events: {} as Events,
    input: {} as { cwd: string; appRef: AppActor },
  },
  actors: {
    ls: lsActor,
    lang: langActor,
  },
}).createMachine({
  invoke: {
    id: "lang",
    systemId: "lang",
    src: "lang",
    input: ({ self }) => ({
      fileTreeRef: self,
    }),
  },
  context: ({ input: { cwd, appRef } }) => ({
    selected_files: [],
    current_is_valid: false,
    base_path: splitPath(cwd ?? "."),
    current_preview: null,
    file_lists: [],
    max_list: 3,
    appRef,
  }),
  initial: "loading",
  on: {
    FileIsValidEvent: {
      actions: assign(({ event }) => ({
        current_is_valid: event.data,
      })),
    },
  },
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
          actions: [
            assign({
              file_lists: ({ context, event }) =>
                context.file_lists.concat({
                  items: event.output,
                  current: event.output.length > 0 ? 0 : null,
                  selected: [],
                }),
            }),
            assign(({ context, event }) => loadSelected(context, event.output)),
            sendTo(
              "lang",
              function ({ context }) {
                return {
                  type: "CurrentUpdateEvent",
                  data: tryGetCurrentItem(context),
                };
              },
            ),
          ],
          target: "ready",
        },
      },
    },
    "ready": {
      // whenever loading is done, includes on first load
      entry: sendTo("lang", function ({ context }) {
        return {
          type: "CurrentUpdateEvent",
          data: tryGetCurrentItem(context),
        };
      }),
      on: {
        next: {
          actions: [
            assign({
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
            sendTo("lang", function ({ context }) {
              return {
                type: "CurrentUpdateEvent",
                data: tryGetCurrentItem(context),
              };
            }),
          ],
        },
        previous: {
          actions: [
            assign({
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

            sendTo(
              "lang",
              function ({ context }) {
                return {
                  type: "CurrentUpdateEvent",
                  data: tryGetCurrentItem(context),
                };
              },
            ),
          ],
        },
        up: {
          actions: [
            assign(({ context }) => {
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
            raise({ type: "up_reload" }),
          ],
        },
        up_reload: [{
          // TODO remove, since guaranteed to be non empty if a parent?
          guard: ({ context }) => context.file_lists.length === 0,
          target: "loading",
        }, { target: "ready" }],
        in: [{
          guard: ({ context }) =>
            tryGetCurrentItem(context)?.endsWith("/") ?? false,
          target: "loading",
        }, { target: "ready" }],
        toggle: {
          actions: [
            assign(({ context }) => toggleSelected(context)),
            sendTo(({ context }) => context.appRef, ({ context }) => ({
              type: "SelectionUpdateEvent",
              data: context.selected_files,
            })),
          ],
        },
      },
    },
  },
});

export type FileTreeMachine = typeof fileTreeMachine;

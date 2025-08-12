import { assign, raise, sendTo, setup } from "xstate";
import { lsActor } from "../lsActor.ts";
import {
  getCurrentItem,
  goUpDirectory,
  loadFiles,
  loadSelected,
  scroll,
  splitPath,
  toggleSelected,
  tryGetCurrentItem,
} from "./helpers.ts";
import { Recipe } from "@stew/lang";
import { getActor } from "../system.ts";

export type FileTreeContext = {
  // absolute path
  base_path: string[];
  current_is_valid: boolean;
  // absolute paths
  selected_files: string[];
  // could be null if folder is empty
  current_preview: Recipe | Error | null;
  file_lists: { items: string[]; current: number | null; selected: number[] }[];
  max_list: 3;
};

export type FileTreeEvents =
  | { type: "previous" }
  | { type: "next" }
  | { type: "up" }
  | { type: "in" }
  | { type: "up_reload" }
  | { type: "toggle" }
  | {
    type: "FileIsValidEvent";
    data: boolean;
  };

export const fileTreeActor = setup({
  types: {
    context: {} as FileTreeContext,
    events: {} as FileTreeEvents,
    input: {} as { cwd: string },
  },
  actors: {
    ls: lsActor,
  },
}).createMachine({
  context: ({ input: { cwd } }) => ({
    selected_files: [],
    current_is_valid: false,
    base_path: splitPath(cwd ?? "."),
    current_preview: null,
    file_lists: [],
    max_list: 3,
  }),
  on: {
    FileIsValidEvent: {
      actions: assign(({ event }) => ({
        current_is_valid: event.data,
      })),
    },
  },
  initial: "loading",
  states: {
    "loading": {
      invoke: {
        src: "ls",
        input: ({ context }) => {
          return {
            folder: getCurrentItem(context),
          };
        },
        onDone: {
          actions: [
            assign((input) => loadFiles(input)),
            assign(({ context, event }) => loadSelected(context, event.output)),
            sendTo(
              ({ system }) => getActor(system, "preview"),
              ({ context }) => {
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
      entry: sendTo(
        ({ system }) => getActor(system, "preview"),
        ({ context }) => {
          return {
            type: "CurrentUpdateEvent",
            data: tryGetCurrentItem(context),
          };
        },
      ),
      on: {
        next: {
          actions: [
            assign(({ context }) => scroll(context, "next")),
            // TODO do not send if current not changed
            sendTo(
              ({ system }) => getActor(system, "preview"),
              ({ context }) => {
                return {
                  type: "CurrentUpdateEvent",
                  data: tryGetCurrentItem(context),
                };
              },
            ),
          ],
        },
        previous: {
          actions: [
            assign(({ context }) => scroll(context, "previous")),
            // TODO do not send if current not changed
            sendTo(
              ({ system }) => getActor(system, "preview"),
              ({ context }) => {
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
            assign(({ context }) => goUpDirectory(context)),
            raise({ type: "up_reload" }),
          ],
        },
        up_reload: [{
          // reload only if changing root directory
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
            sendTo(({ system }) => getActor(system, "app"), ({ context }) => ({
              type: "SelectionUpdateEvent",
              data: context.selected_files,
            })),
          ],
        },
      },
    },
  },
});

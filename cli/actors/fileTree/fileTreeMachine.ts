import { ActorRef, assign, raise, sendTo, setup, Snapshot } from "xstate";
import { Recipe } from "../../../lang/mod.ts";
import { lsActorLogic } from "../lsActorLogic.ts";
import type { AppActorRef } from "../appMachine.ts";
import { langMachine } from "../lang/langMachine.ts";
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

export type FileTreeRef = ActorRef<
  Snapshot<unknown>,
  Events
>;

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
  appRef: AppActorRef;
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
    context: {} as FileTreeContext,
    events: {} as Events,
    input: {} as { cwd: string; appRef: AppActorRef },
  },
  actors: {
    ls: lsActorLogic,
    lang: langMachine,
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
          return {
            folder: getCurrentItem(context),
          };
        },
        onDone: {
          actions: [
            assign((input) => loadFiles(input)),
            assign(({ context, event }) => loadSelected(context, event.output)),
            sendTo(
              "lang",
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
      entry: sendTo("lang", ({ context }) => {
        return {
          type: "CurrentUpdateEvent",
          data: tryGetCurrentItem(context),
        };
      }),
      on: {
        next: {
          actions: [
            assign(({ context }) => scroll(context, "next")),
            // TODO do not send if current not changed
            sendTo("lang", ({ context }) => {
              return {
                type: "CurrentUpdateEvent",
                data: tryGetCurrentItem(context),
              };
            }),
          ],
        },
        previous: {
          actions: [
            assign(({ context }) => scroll(context, "previous")),
            // TODO do not send if current not changed
            sendTo(
              "lang",
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

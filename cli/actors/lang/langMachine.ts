import { assign, raise, sendTo, setup } from "xstate";
import { Recipe, StewLang } from "../../../lang/mod.ts";
import type { FileTreeRef } from "../fileTree/fileTreeMachine.ts";
import { readFilesActorLogic } from "./readFileActorLogic.ts";
import { setCurrent } from "./helpers.ts";

export type PreviewEvent = {
  type: "PreviewEvent";
  data: boolean;
};

export type CurrentUpdateEvent = {
  type: "CurrentUpdateEvent";
  data: string | string[] | null;
};

// TODO what to do about the headers on each file...
function interpret(fileContents: string[]) {
  const file = fileContents.join("\n");
  if (!file) return null;
  const lang = new StewLang();

  return lang.read(file);
}

export type LangContext = {
  fileTreeRef: FileTreeRef;
  fileContents: string[] | null;
  current: string[] | null;
  recipe: Recipe | null;
  error: Error | null;
};

export const langMachine = setup({
  types: {
    input: {} as { fileTreeRef: FileTreeRef },
    context: {} as LangContext,
    events: {} as CurrentUpdateEvent | { type: "decideToPreview" },
  },
  actors: {
    read: readFilesActorLogic,
  },
}).createMachine({
  context({ input: { fileTreeRef } }) {
    return {
      fileTreeRef,
      fileContents: null,
      current: null,
      recipe: null,
      error: null,
    };
  },
  initial: "ready",
  states: {
    "ready": {
      on: {
        CurrentUpdateEvent: {
          guard: function ({ context, event: { data } }) {
            // deduplicate events
            return data !== context.current;
          },
          actions: [
            assign(setCurrent),
            raise({ type: "decideToPreview" }),
          ],
        },
        decideToPreview: {
          guard: function ({ context: { current } }) {
            return current !== null;
          },
          target: "previewing",
        },
      },
    },
    "previewing": {
      invoke: {
        src: "read",
        input({ context: { current } }) {
          return {
            filePaths: current ?? [],
          };
        },
        onDone: {
          actions: [
            assign(function ({ event }) {
              return {
                fileContents: event.output,
              };
            }),
            assign(({ context }) => {
              try {
                return {
                  recipe: interpret(context.fileContents ?? []),
                  error: null,
                };
              } catch (error) {
                return {
                  recipe: null,
                  error: error as Error,
                };
              }
            }),
            sendTo(
              ({ context }) => context.fileTreeRef,
              function ({ context }) {
                return {
                  type: "FileIsValidEvent",
                  data: !context.error,
                };
              },
            ),
          ],
          target: "ready",
        },
      },
    },
    "respond": {
      entry: sendTo(
        ({ context }) => context.fileTreeRef,
        function ({ context }) {
          return {
            type: "FileIsValidEvent",
            data: !context.error,
          };
        },
      ),
      target: "ready",
    },
  },
});

export type LangMachine = typeof langMachine;

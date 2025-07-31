import { assign, raise, sendTo, setup } from "xstate";
import { readFilesActor } from "../readFileActor.ts";
import { setCurrent } from "./helpers.ts";
import { Recipe, StewLang } from "@stew/lang";
import { getActor } from "../system.ts";

export type PreviewEvents = {
  type: "CurrentUpdateEvent";
  data: string | string[] | null;
} | { type: "decideToPreview" };

// TODO what to do about the headers on each file...
function interpret(fileContents: string[]) {
  const file = fileContents.join("\n");
  if (!file) return null;
  const lang = new StewLang();

  return lang.read(file);
}

export type PreviewContext = {
  fileContents: string[] | null;
  current: string[] | null;
  currentIngredient: number | null;
  recipe: Recipe | null;
  error: Error | null;
};

export const previewActor = setup({
  types: {
    context: {} as PreviewContext,
    events: {} as PreviewEvents,
  },
  actors: {
    read: readFilesActor,
  },
}).createMachine({
  context: {
    fileContents: null,
    currentIngredient: null,
    current: null,
    recipe: null,
    error: null,
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
            assign(({ context }) => {
              return {
                currentIngredient: context.recipe?.ingredients.at(0) ? 0 : null,
              };
            }),
            sendTo(
              ({ system }) => getActor(system, "fileTree"),
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
        ({ system }) => getActor(system, "fileTree"),
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

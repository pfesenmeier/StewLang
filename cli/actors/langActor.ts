import { assign, fromPromise, raise, sendTo, setup } from "xstate";
import { Recipe, StewLang } from "../../lang/mod.ts";
import { FileTreeActor } from "./fileTreeMachine.ts";
import { ActorInput } from "./helpers.ts";

export type PreviewEvent = {
  type: "PreviewEvent";
  data: boolean;
};

export type CurrentUpdateEvent = {
  type: "CurrentUpdateEvent";
  data: string | string[] | null;
};

const previewActor = fromPromise(
  (
    { input: { filePath } }: ActorInput<{ filePath: string | string[] | null }>,
  ) => preview(filePath),
);

export const langActor = setup({
  types: {
    input: {} as { fileTreeRef: FileTreeActor },
    context: {} as {
      fileTreeRef: FileTreeActor;
      current: string | string[] | null;
      recipe: Recipe | null;
      error: Error | null;
    },
    events: {} as CurrentUpdateEvent | { type: "decideToPreview" },
  },
  actors: {
    preview: previewActor,
  },
}).createMachine({
  context({ input: { fileTreeRef } }) {
    return {
      fileTreeRef,
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
          guard: function ({ context, event }) {
            // deduplicate events
            return event.data !== context.current;
          },
          actions: [
            assign(function ({ event }) {
              if (event.data === null) {
                return {
                  current: null,
                  preview: undefined,
                };
              }

              return {
                current: event.data,
              };
            }),
            raise({ type: "decideToPreview" }),
          ],
          target: "decideToPreview",
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
        src: "preview",
        input({ context: { current } }) {
          return {
            filePath: current,
          };
        },
        onDone: {
          actions: [
            assign(function ({ event }) {
              return {
                recipe: event.output,
                error: null,
              };
            }),
          ],
          target: "respond",
        },
        onError: {
          actions: [
            assign(function ({ event }) {
              return {
                error: event.error as Error,
                recipe: null,
              };
            }),
          ],
          target: "respond",
        },
      },
    },
    "respond": {
      always: {
        actions: [
          sendTo(function ({ context }) {
            return context.fileTreeRef;
          }, function ({ context }) {
            return {
              type: "FileIsValidEvent",
              data: !context.error,
            };
          }),
        ],
      },
    },
  },
});

async function preview(filePath: string | string[] | null) {
  if (!filePath) return;

  const lang = new StewLang();
  let file = "";

  if (typeof filePath === "string") {
    file = await Deno.readTextFile(filePath);
  } else {
    for (const path of filePath) {
      file += await Deno.readTextFile(path);
    }
  }

  return lang.read(file);
}

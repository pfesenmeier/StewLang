import { assign, createActor, fromPromise, raise, sendTo, setup } from "xstate";
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

export type LangContext = {
  fileTreeRef: FileTreeActor;
  current: string | string[] | null;
  recipe: Recipe | null;
  error: Error | null;
};

export const langActor = setup({
  types: {
    input: {} as { fileTreeRef: FileTreeActor },
    context: {} as LangContext,
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
          guard: function ({ context, event: { data } }) {
            // deduplicate events
            return data !== context.current;
          },
          actions: [
            assign(function ({ event: { data } }) {
              console.log("CurrentUpdateEvent received");
              console.log("current", data);
              if (
                data === null ||
                (typeof data === "string" && !data.endsWith(".sw"))
              ) {
                return {
                  current: null,
                  preview: undefined,
                };
              }

              return {
                current: data,
              };
            }),
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
        onError: {
          actions: [
            assign(function ({ event }) {
              return {
                error: event.error as Error,
                recipe: null,
              };
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

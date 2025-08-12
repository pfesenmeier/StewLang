import { assign, raise, setup } from "xstate";
import {
  FileTreeContext,
  goUpDirectory,
  initialFileTreeContext,
  isOnFolder,
  loadFiles,
  loadSelected,
  lsInput,
  rootChanged,
  scrollDown,
  scrollUp,
  toggleSelected,
} from "./fileTreeOperations.ts";
import { KeyPressEvents } from "../keyPressEvents.ts";
import { readFile } from "./readFile.ts";
import { ls } from "./ls.ts";
import {
  canPreview,
  fileTreeSetCurrentPreview,
  initialPreviewContext,
  PreviewContext,
  previewSetFileTreeFileIsValid,
  readInput,
  scrollNextIngredient,
  scrollPreviousIngredient,
  setFileContents,
  trySetCurrentIngredient,
  trySetRecipe,
} from "./previewOperations.ts";

// better to "invoke" a new actor on entry?
// these are cows that can be cut down

export type SelectedContext = {
  selected_files: string[];
};

export type AppContext = {
  fileTree: FileTreeContext;
  selected: SelectedContext;
  preview: PreviewContext;
};

export type AppParams = {
  context: AppContext;
};

export type AppUpdate<TKey extends keyof AppContext> =
  & Pick<AppContext, TKey>
  & Partial<
    AppContext
  >;

type AppInput = { cwd: string };

const initialContext = ({ input }: { input: AppInput }): AppContext => ({
  fileTree: initialFileTreeContext({ input }),
  selected: {
    selected_files: [],
  },
  preview: initialPreviewContext,
});

type InternalEvents =
  | { type: "upReload" }
  | { type: "updatePreview" };

export const app2 = setup({
  types: {
    context: {} as AppContext,
    input: {} as AppInput,
    events: {} as KeyPressEvents | InternalEvents,
  },
  actors: {
    ls,
  },
}).createMachine({
  type: "parallel",
  context: initialContext,
  states: {
    firstStage: {
      type: "parallel",
      states: {
        // states that determine how keypresses are interpretted
        ui: {
          states: {
            browsing: {
              initial: "loading",
              states: {
                loading: {
                  invoke: {
                    src: "ls",
                    input: lsInput,
                    onDone: {
                      actions: [
                        assign(loadFiles),
                        assign(loadSelected),
                      ],
                      target: "updatingPreview",
                    },
                  },
                },
                updatingPreview: {
                  entry: [
                    // TODO... send data in the event?
                    assign(fileTreeSetCurrentPreview),
                    raise({ type: "updatePreview" }),
                  ],
                  target: "ready",
                },
                ready: {
                  on: {
                    down: {
                      actions: assign(scrollDown),
                      target: "updatingPreview",
                    },
                    up: {
                      actions: assign(scrollUp),
                      target: "updatingPreview",
                    },
                    left: {
                      actions: assign(goUpDirectory),
                      target: "updatingPreview",
                    },
                    upReload: [{
                      guard: rootChanged,
                      target: "loading",
                    }, { target: "ready" }],
                    right: [{
                      guard: isOnFolder,
                      target: "loading",
                    }, { target: "ready" }],
                    space: {
                      actions: assign(toggleSelected),
                    },
                  },
                },
              },
            },
            previewing: {
              on: {
                left: {
                  actions: assign(scrollPreviousIngredient),
                },
                right: {
                  actions: assign(scrollNextIngredient),
                },
              },
            },
            selecting: {},
          },
        },
        // async reading source files. listens to "updatePreview" event
        data: {
          initial: "ready",
          entry: raise({ type: "updatePreview" }),
          on: {
            updatePreview: [{
              guard: canPreview,
              target: "previewing",
            }, {
              target: "ready",
            }],
          },
          states: {
            ready: {},
            previewing: {
              invoke: {
                src: readFile,
                input: readInput,
                onDone: {
                  actions: [
                    // TODO why unknown  ?
                    // deno-lint-ignore no-explicit-any
                    assign(setFileContents as any),
                    assign(trySetRecipe),
                    assign(trySetCurrentIngredient),
                    // TODO re-implement "prevent select invalid file" logic
                    assign(previewSetFileTreeFileIsValid),
                  ],
                },
              },
            },
          },
        },
      },
    },
  },
});

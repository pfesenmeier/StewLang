import { assign, log, raise, setup } from "xstate";
import {
  FileTreeContext,
  goUpDirectory,
  initialFileTreeContext,
  isOnFolder,
  isOnStewLangFile,
  loadFiles,
  loadSelected,
  lsInput,
  rootChanged,
  scrollDown,
  scrollUp,
  toggleSelected,
} from "./fileTreeOperations.ts";
import { KeyPressEvents } from "./keyPressEvents.ts";
import { readFile } from "./readFile.ts";
import { ls } from "./ls.ts";
import {
  canPreview,
  fileTreeSetCurrentPreview,
  initialPreviewContext,
  isOnFirstIngredient,
  isOnLastIngredient,
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

export const app = setup({
  types: {
    context: {} as AppContext,
    input: {} as AppInput,
    events: {} as KeyPressEvents | InternalEvents,
  },
  actors: {
    ls,
  },
}).createMachine({
  initial: "welcome",
  context: initialContext,
  states: {
    welcome: {
      on: {
        "*": "firstStage",
      },
    },
    help: {
      id: "help",
      on: {
        // TODO what about second stage... maybe no need
        // or turn this to "first stage help", etc..
        "*": "firstStage.ui.hist",
      },
    },
    firstStage: {
      type: "parallel",
      states: {
        // states that determine how keypresses are interpretted
        ui: {
          initial: "browsing",
          on: {
            help: "#help",
          },
          states: {
            hist: {
              type: "history",
            },
            browsing: {
              initial: "init",
              on: {
                tab: "previewing",
                shiftab: "selecting",
              },
              states: {
                init: {
                  always: [{ target: "loading", guard: rootChanged }, {
                    target: "ready",
                  }],
                },
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
                  always: {
                    target: "ready",
                  },
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
                      target: "init",
                    },
                    upReload: [{
                      guard: rootChanged,
                      target: "loading",
                    }, { target: "ready" }],
                    right: [{
                      guard: isOnFolder,
                      target: "loading",
                    }, {
                      guard: isOnStewLangFile,
                      target: "#previewing",
                    }, { target: "ready" }],
                    space: {
                      actions: assign(toggleSelected),
                    },
                  },
                },
              },
            },
            previewing: {
              id: "previewing",
              on: {
                left: [{
                  guard: isOnFirstIngredient,
                  target: "browsing",
                }, {
                  actions: assign(scrollPreviousIngredient),
                }],
                right: [{
                  guard: isOnLastIngredient,
                  target: "selecting",
                }, {
                  actions: assign(scrollNextIngredient),
                }],
                tab: "selecting",
                shiftab: "browsing",
              },
            },
            selecting: {
              on: {
                left: "previewing",
                tab: "browsing",
                shiftab: "previewing",
              },
            },
          },
        },
        // async reading source files. listens to "updatePreview" event
        data: {
          initial: "ready",
          states: {
            ready: {
              on: {
                updatePreview: {
                  guard: canPreview,
                  target: "previewing",
                },
              },
            },
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
                    assign(previewSetFileTreeFileIsValid),
                  ],
                  target: "ready",
                },
                onError: {
                  target: "ready",
                },
              },
            },
          },
        },
      },
    },
  },
});

import { setup } from "xstate";
import { appActor } from "./appActor.ts";
import { fileTreeActor } from "./fileTree/fileTreeActor.ts";
import { previewActor } from "./preview/previewActor.ts";
import { systemIds } from "./system.ts";
import { welcomeActor } from "./welcomeActor.ts";

export const rootActor = setup({
  types: {
    input: {} as { cwd: string },
    context: {} as { cwd: string },
  },
  actors: {
    fileTree: fileTreeActor,
    app: appActor,
    preview: previewActor,
    welcome: welcomeActor,
  },
}).createMachine({
  initial: "running",
  context: ({ input: { cwd } }) => ({
    cwd,
  }),
  invoke: [
    { src: "app", systemId: systemIds.app },
    {
      src: "fileTree",
      systemId: systemIds.fileTree,
      input: ({ context: { cwd } }) => ({ cwd }),
    },
    { src: "preview", systemId: systemIds.preview },
  ],
  states: {
    running: {},
  },
});

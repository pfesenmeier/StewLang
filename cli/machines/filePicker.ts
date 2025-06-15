import { createActor, createMachine } from "npm:xstate";
import { FileInfo } from "@std/fs"

export const filePickerMachine = createMachine({
  id: "filePicker",
  initial: "Active",
  context: { selected: [], root: null, cwd: null, highlighted: null },
  states: {
    Active: {},
  },
});

export function createFilePickerActor(opts: { root: FileInfo }) {
  return createActor(filePickerMachine, {
    input: {
      root: opts.root,
    },
  });
}

import { setup } from "xstate";
import { Recipe, StewLang } from "@stew/lang"


const lang = new StewLang()

export type Context = {
  current_folder: string;
  // could be null if folder is empty
  current_item: string | null;
  select_files: string[];
  current_preview: Recipe
};

export type Events =
  | { type: "files.previous" }
  | { type: "files.next" }
  | { type: "files.up" }
  | { type: "files.children" }
  | { type: "files.select" }
  | { type: "files.unselect" };

export function createAppMachine(cwd: string) {
  return setup({
    types: {
      context: {} as Context,
      events: {} as Events
    },
  }).createMachine({
    context: {
      select_files: [],
      current_item: null,
      current_folder: cwd,
    },
  });
}

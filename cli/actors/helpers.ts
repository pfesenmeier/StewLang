import { dirname, join, relative, SEPARATOR } from "@std/path";
import { Context } from "./fileTreeMachine.ts";

export type ActorInput<T> = {
  input: T;
};

const root = Deno.build.os === "windows" ? "C:\\" : "/";

export function splitPath(path: string) {
  const relpath = relative(root, path);

  const relpathlist = relpath.split(SEPARATOR);

  return [root, ...relpathlist];
}

export function joinPath(path: string[]) {
  const first = path.at(0);

  if (!first) return "";

  return join(first, ...path.slice(1));
}

export function getCurrentItem(
  context: Pick<Context, "file_lists" | "base_path">,
) {
  const shownPath = context.file_lists.map(({ items, current }) => {
    if (current === null) {
      throw new Error("no current item, since folder is empty");
    }
    const result = items.at(current);

    if (!result) throw new Error("current not set correctly");

    return result;
  });

  return joinPath([...context.base_path, ...shownPath]);
}

export function getCwd(
  context: Pick<Context, "file_lists" | "base_path">,
) {
  const currentItem = getCurrentItem(context);

  return dirname(currentItem);
}

// handles case where file is selected, leave directory, then return
export function loadSelected(
  context: Pick<Context, "file_lists" | "base_path" | "selected_files">,
  names: string[],
): Pick<Context, "file_lists"> {
  const cwd = getCwd(context);

  const indexes: number[] = [];
  for (const [index, file] of names.entries()) {
    const fileName = joinPath([cwd, file]);

    if (context.selected_files.includes(fileName)) {
      indexes.push(index);
    }
  }

  const file_lists = [...context.file_lists];
  file_lists.at(-1)!.selected = indexes;

  return { file_lists };
}

export function toggleSelected(
  context: Pick<Context, "file_lists" | "base_path" | "selected_files">,
): Pick<Context, "selected_files" | "file_lists"> {
  const current = getCurrentItem(context);

  if (!current.endsWith(".sw")) return context

  if (context.selected_files.includes(current)) {
    const new_files = [...context.file_lists];
    const last = new_files.at(-1)!;
    last.selected = last.selected.filter((index) => index !== last.current);

    return {
      file_lists: new_files,
      selected_files: context.selected_files.filter(
        (file) => file !== current,
      ),
    };
  }

  const new_files = [...context.file_lists];
  const last = new_files.at(-1)!;
  last.selected.push(last.current!);

  return {
    file_lists: new_files,
    selected_files: [...context.selected_files, current],
  };
}

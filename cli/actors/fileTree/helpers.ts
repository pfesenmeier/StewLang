import { dirname, join, relative, SEPARATOR } from "@std/path";
import { FileTreeContext } from "./fileTreeActor.ts";
import { DoneActorEvent } from "xstate";

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

export function loadFiles(
  { context, event }: {
    context: Pick<FileTreeContext, "file_lists">;
    event: DoneActorEvent<string[], string>;
  },
): Pick<FileTreeContext, "file_lists"> {
  return {
    file_lists: context.file_lists.concat({
      items: event.output,
      current: event.output.length > 0 ? 0 : null,
      selected: [],
    }),
  };
}

export function scroll(
  context: Pick<FileTreeContext, "file_lists">,
  direction: "next" | "previous",
): Partial<Pick<FileTreeContext, "file_lists">> {
  const file_lists = [...context.file_lists];
  const last = file_lists.at(-1);

  if (!last) return {};
  if (last.current === null) return {};

  if (direction === "next" && last.current < last.items.length - 1) {
    last.current++;
  }

  if (direction === "previous" && last.current > 0) {
    last.current--;
  }

  return { file_lists };
}

export function goUpDirectory(
  context: Pick<FileTreeContext, "file_lists" | "base_path">,
): Partial<Pick<FileTreeContext, "file_lists" | "base_path">> {
  const listLength = context.file_lists.length;
  const basePathLength = context.base_path.length;

  const atRootDir = basePathLength === 1 && listLength === 1;
  const needChangeRootDir = basePathLength > 1 && listLength === 1;

  if (atRootDir) {
    return {};
  }

  if (needChangeRootDir) {
    return {
      file_lists: context.file_lists.slice(0, -1),
      base_path: context.base_path.slice(0, -1),
    };
  }

  return {
    file_lists: context.file_lists.slice(0, -1),
  };
}

export function getCurrentItem(
  context: Pick<FileTreeContext, "file_lists" | "base_path">,
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

export function tryGetCurrentItem(
  context: Pick<FileTreeContext, "file_lists" | "base_path">,
) {
  try {
    return getCurrentItem(context);
  } catch {
    return null;
  }
}

export function getCwd(
  context: Pick<FileTreeContext, "file_lists" | "base_path">,
) {
  const currentItem = getCurrentItem(context);

  return dirname(currentItem);
}

// handles case where file is selected, leave directory, then return
export function loadSelected(
  context: Pick<FileTreeContext, "file_lists" | "base_path" | "selected_files">,
  names: string[],
): Partial<Pick<FileTreeContext, "file_lists">> {
  let cwd = "";

  // TODO gross
  try {
    cwd = getCwd(context);
  } catch {
    console.debug("treating folder as empty");
    return {};
  }

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
  context: Pick<FileTreeContext, "file_lists" | "base_path" | "selected_files">,
): Pick<FileTreeContext, "selected_files" | "file_lists"> {
  const current = getCurrentItem(context);

  if (!current.endsWith(".sw")) return context;

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

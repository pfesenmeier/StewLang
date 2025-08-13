import { dirname, join, relative, SEPARATOR } from "@std/path";
import { DoneActorEvent } from "xstate";
import { Recipe } from "@stew/lang";
import { AppParams, AppUpdate } from "./app.ts";

export type FileTreeContext = {
  // absolute path
  base_path: string[];
  current_is_valid: boolean;
  // could be null if folder is empty
  current_preview: Recipe | Error | null;
  file_lists: { items: string[]; current: number | null; selected: number[] }[];
  max_list: 3;
};

export type FileTreeInput = { cwd: string };
type Update = AppUpdate<"fileTree">;

export const initialFileTreeContext = (
  { input: { cwd } }: { input: FileTreeInput },
): FileTreeContext => ({
  current_is_valid: false,
  base_path: splitPath(cwd ?? "."),
  current_preview: null,
  file_lists: [],
  max_list: 3,
});

const root = Deno.build.os === "windows" ? "C:\\" : "/";

// reload only if changing root directory
export function rootChanged({ context: { fileTree } }: AppParams): boolean {
  return fileTree.file_lists.length === 0;
}

export function isOnFolder(params: AppParams): boolean {
  return tryGetCurrentItem(params)?.endsWith("/") ?? false;
}

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
  {
    context,
    event,
  }: AppParams & {
    event: DoneActorEvent<string[], string>;
  },
): Update {
  return {
    fileTree: {
      ...context.fileTree,
      file_lists: context.fileTree.file_lists.concat({
        items: event.output,
        current: event.output.length > 0 ? 0 : null,
        selected: [],
      }),
    },
  };
}

function scroll(
  { context }: AppParams,
  direction: "next" | "previous",
): Update {
  const file_lists = [...context.fileTree.file_lists];
  const last = file_lists.at(-1);

  if (!last) return context;
  if (last.current === null) return context;

  let newCurrent = last.current;

  if (direction === "next" && last.current < last.items.length - 1) {
    newCurrent++;
  }

  if (direction === "previous" && last.current > 0) {
    newCurrent--;
  }

  file_lists[file_lists.length - 1] = {
    ...last,
    current: newCurrent,
  };

  return {
    fileTree: {
      ...context.fileTree,
      file_lists,
    },
  };
}

export function scrollUp(params: AppParams) {
  return scroll(params, "previous");
}

export function scrollDown(params: AppParams) {
  return scroll(params, "next");
}

export function goUpDirectory(
  { context }: AppParams,
): Update {
  const { fileTree } = context;
  const listLength = fileTree.file_lists.length;
  const basePathLength = fileTree.base_path.length;

  const atRootDir = basePathLength === 1 && listLength === 1;
  const needChangeRootDir = basePathLength > 1 && listLength === 1;

  if (atRootDir) {
    return context;
  }

  if (needChangeRootDir) {
    return {
      fileTree: {
        ...fileTree,
        file_lists: fileTree.file_lists.slice(0, -1),
        base_path: fileTree.base_path.slice(0, -1),
      },
    };
  }

  return {
    fileTree: {
      ...fileTree,
      file_lists: fileTree.file_lists.slice(0, -1),
    },
  };
}

export function lsInput(params: AppParams) {
  return {
    folder: getCurrentItem(params),
  };
}

export function getCurrentItem(
  { context: { fileTree } }: AppParams,
) {
  const shownPath = fileTree.file_lists.map(({ items, current }) => {
    if (current === null) {
      throw new Error("no current item, since folder is empty");
    }
    const result = items.at(current);

    if (!result) throw new Error("current not set correctly");

    return result;
  });

  return joinPath([...fileTree.base_path, ...shownPath]);
}

export function tryGetCurrentItem(
  context: AppParams,
) {
  try {
    return getCurrentItem(context);
  } catch {
    return null;
  }
}

export function getCwd(
  params: AppParams,
) {
  const currentItem = getCurrentItem(params);

  return dirname(currentItem);
}

// handles case where file is selected, leave directory, then return
export function loadSelected(
  params: AppParams & {
    event: DoneActorEvent<string[], string>;
  },
): Update {
  const names = params.event.output;
  let cwd = "";

  // TODO gross
  try {
    cwd = getCwd(params);
  } catch {
    console.debug("treating folder as empty");
    return params.context;
  }

  const { context } = params;

  const indexes: number[] = [];
  for (const [index, file] of names.entries()) {
    const fileName = joinPath([cwd, file]);

    if (context.selected.selected_files.includes(fileName)) {
      indexes.push(index);
    }
  }

  const file_lists = [...context.fileTree.file_lists];
  file_lists.at(-1)!.selected = indexes;

  return { fileTree: { ...context.fileTree, file_lists } };
}

export function toggleSelected(
  params: AppParams,
): AppUpdate<"selected" | "fileTree"> {
  const current = getCurrentItem(params);
  const { fileTree, selected } = params.context;

  if (!current.endsWith(".sw")) return params.context;

  if (selected.selected_files.includes(current)) {
    const new_files = [...fileTree.file_lists];
    const last = new_files.at(-1)!;
    last.selected = last.selected.filter((index) => index !== last.current);

    return {
      fileTree: {
        ...fileTree,
        file_lists: new_files,
      },
      selected: {
        ...selected,
        selected_files: selected.selected_files.filter(
          (file) => file !== current,
        ),
      },
    };
  }

  const new_files = [...fileTree.file_lists];
  const last = new_files.at(-1)!;
  last.selected.push(last.current!);

  return {
    fileTree: {
      ...fileTree,
      file_lists: new_files,
    },
    selected: {
      ...selected,
      selected_files: [...selected.selected_files, current],
    },
  };
}

import { Recipe, StewLang } from "@stew/lang";
import { AppParams, AppUpdate } from "./app.ts";
import { tryGetCurrentItem } from "./fileTreeOperations.ts";
import { EventOutput } from "./helpers.ts";

export type PreviewContext = {
  fileContents: string[] | null;
  current: string[] | null;
  currentIngredient: number | null;
  recipe: Recipe | null;
  error: Error | null;
};

export const initialPreviewContext: PreviewContext = {
  fileContents: null,
  currentIngredient: null,
  current: null,
  recipe: null,
  error: null,
};

type Update = AppUpdate<"preview">;

export function canPreview({ context }: AppParams): boolean {
  return context.preview.current !== null;
}

export function isOnFirstIngredient({ context }: AppParams): boolean {
  const { currentIngredient } = context.preview;
  return currentIngredient === 0 || currentIngredient === null;
}

export function isOnLastIngredient({ context }: AppParams): boolean {
  const { currentIngredient, recipe } = context.preview;
  if (!recipe || recipe.ingredients.length === 0) return false;
  return currentIngredient === recipe.ingredients.length - 1;
}

export function setCurrentToFirstRecipe(
  { context: { preview } }: AppParams,
): Update {
  return {
    preview: {
      ...preview,
      currentIngredient: preview.recipe?.ingredients.at(0) ? 0 : null,
    },
  };
}

export function fileTreeSetCurrentPreview(
  params: AppParams,
): Update {
  // TODO handle multi selection
  const data = tryGetCurrentItem(params);
  const cannotPreview = data === null ||
    typeof data === "string" && !data.endsWith(".sw");

  const { preview } = params.context;

  if (cannotPreview) {
    return {
      preview: {
        ...preview,
        current: null,
        fileContents: null,
        recipe: null,
        error: null,
      },
    };
  }

  return {
    preview: {
      ...preview,
      current: typeof data === "string" ? [data] : data,
    },
  };
}

export function previewSetFileTreeFileIsValid(
  { context }: AppParams,
): AppUpdate<"fileTree"> {
  return {
    fileTree: {
      ...context.fileTree,
      current_is_valid: !context.preview.error,
    },
  };
}

export function readInput({ context: { preview } }: AppParams) {
  return {
    filePaths: preview.current ?? [],
  };
}

export const setFileContents = (
  { event, context: { preview } }:
    & { event: EventOutput<string[]> }
    & AppParams,
): Update => {
  return {
    preview: {
      ...preview,
      fileContents: event.output,
    },
  };
};

// TODO what to do about the headers on each file...
function interpret(fileContents: string[]) {
  const file = fileContents.join("\n");
  if (!file) return null;
  const lang = new StewLang();

  return lang.read(file);
}

export function trySetRecipe({ context: { preview } }: AppParams): Update {
  try {
    return {
      preview: {
        ...preview,
        // TODO guard against null ?
        recipe: interpret(preview.fileContents ?? []),
        error: null,
      },
    };
  } catch (error) {
    return {
      preview: {
        ...preview,
        recipe: null,
        error: error as Error,
      },
    };
  }
}

export function trySetCurrentIngredient(
  { context: { preview } }: AppParams,
): Update {
  return {
    preview: {
      ...preview,
      currentIngredient: preview.recipe?.ingredients.at(0) ? 0 : null,
    },
  };
}

function scrollIngredients(
  { context: { preview } }: AppParams,
  direction: "next" | "previous",
): Update {
  if (!preview.recipe) return { preview };

  const current = preview.currentIngredient ?? 0;
  const currentIngredient = direction === "next" ? current + 1 : current - 1;

  const updated = preview.recipe.ingredients.at(currentIngredient);

  if (!updated) return { preview };

  return {
    preview: {
      ...preview,
      currentIngredient,
    },
  };
}

export function scrollNextIngredient(
  params: AppParams,
): Update {
  return scrollIngredients(params, "next");
}

export function scrollPreviousIngredient(
  params: AppParams,
): Update {
  return scrollIngredients(params, "previous");
}

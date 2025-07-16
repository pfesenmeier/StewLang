import { LangContext } from "./langMachine.ts";
import { CurrentUpdateEvent } from "./langMachine.ts";

export function setCurrent(
  { event: { data } }: { event: CurrentUpdateEvent },
): Partial<LangContext> {
  // TODO handle multi selection
  const cannotPreview = data === null ||
    typeof data === "string" && !data.endsWith(".sw");

  if (cannotPreview) {
    return {
      current: null,
      fileContents: null,
      recipe: null,
      error: null,
    };
  }

  return {
    current: typeof data === "string" ? [data] : data,
  };
}

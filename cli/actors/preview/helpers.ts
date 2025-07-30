import { PreviewContext, PreviewEvents } from "./previewActor.ts";

type CurrentUpdateEvent = Extract<
  PreviewEvents,
  { type: "CurrentUpdateEvent" }
>;
export function setCurrent(
  { event: { data } }: { event: CurrentUpdateEvent },
): Partial<PreviewContext> {
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

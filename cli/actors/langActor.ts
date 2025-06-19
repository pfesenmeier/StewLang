import { fromPromise } from "xstate";
import { StewLang } from "../../lang/mod.ts";
import { ActorInput } from "./helpers.ts";

export const langActor = fromPromise(
  (
    { input: { filePath } }: ActorInput<{ filePath: string | null }>,
  ) => preview(filePath),
);

async function preview(filePath: string | null) {
  if (!filePath) return;

  const lang = new StewLang();
  const file = await Deno.readTextFile(filePath);

  try {
    return lang.read(file);
  } catch (error) {
    return error as Error;
  }
}

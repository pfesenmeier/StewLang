import { fromPromise } from "xstate";
import { ActorInput } from "./helpers.ts";

export const readFilesActor = fromPromise((
  { input: { filePaths } }: ActorInput<{ filePaths: string[] }>,
) => Promise.all(filePaths.map((file) => Deno.readTextFile(file))));

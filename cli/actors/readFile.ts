import { fromPromise } from "xstate";
import { ActorInput } from "./helpers.ts";

export const readFile = fromPromise((
  { input: { filePaths } }: ActorInput<{ filePaths: string[] }>,
) => Promise.all(filePaths.map((file) => Deno.readTextFile(file))));

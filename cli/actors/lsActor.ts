import { parse } from "@std/path";
import { fromPromise } from "xstate";
import { ActorInput } from "./helpers.ts";

export const lsActor = fromPromise(
  async ({ input: { folder } }: ActorInput<{ folder: string }>) => {
    const fileNames: string[] = [];

    for await (const file of Deno.readDir(folder)) {
      if (file.isFile && parse(file.name).ext === ".sw") {
        fileNames.push(file.name);
      } else if (file.isDirectory) {
        fileNames.push(file.name + "/");
      }
    }

    return fileNames;
  },
);

import { expandGlob } from "@std/fs/expand-glob";
import { join, relative } from "@std/path";
import { StewError, StewLang } from "@stew/lang";

export async function check(directory: string) {
  let isSuccess = true;

  console.info("File\tOutcome\tLine\tError\tHint");
  for await (const [recipe, path] of readAllStewFiles(directory)) {
    if (recipe instanceof StewError) {
      console.info(
        `%c${path}\tError\t${recipe.line}\t${recipe.message}\t${
          recipe.hint ?? ""
        }`,
        "color: red",
      );
      isSuccess = false;
      continue;
    }

    console.info(`%c${path}\tSuccess\t\t\t`, "color: green");
  }

  if (!isSuccess) {
    Deno.exit(1);
  }
}

async function* readAllStewFiles(directory: string) {
  const glob = join(directory, "**", "*.sw");
  const lang = new StewLang();

  for await (const entry of expandGlob(glob)) {
    const path = relative(".", entry.path);
    const contents = await Deno.readTextFile(path);
    yield [lang.read(contents), path] as const;
  }
}

import { expandGlob } from "jsr:@std/fs/expand-glob";
import { join, relative } from "@std/path";
import { StewLang } from "@stew/lang";

// TODO table export to nushell
export async function check(directory: string, csv = false) {
  // TODO -- does stewlang have an entrypoint?
  const glob = join(directory, "**", "*.sw");
  const lang = new StewLang();
  let success = 0;
  let total = 0;

  const entries = await Array.fromAsync(expandGlob(glob));
  const paths = entries.map((entry) => relative(".", entry.path));
  const longestPath = paths.reduce((p, c) => Math.max(p, c.length), 0);

  for (const path of paths) {
    total++;

    try {
      const contents = await Deno.readTextFile(path);
      lang.read(contents);
    } catch (e) {
      const err = e as Error;
      console.error(
        `%cError:   ${path.padEnd(longestPath)}\t${err.message}`,
        "color: red",
      );
      continue;
    }

    console.info(`%cSuccess: ${path}`, "color: green");
    success += 1;
  }

  console.log();
  console.log(`%cResult:\t${success}/${total}`, "color: blue");
}

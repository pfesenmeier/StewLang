import { expandGlob } from "jsr:@std/fs/expand-glob"
import { join } from "@std/path"
import { StewLang } from "@stew/lang";

export async function check(directory: string) {
  // TODO -- does stewlang have an entrypoint?
  const glob = join(directory, "**", "*.sw")
  const lang = new StewLang()
  for await (const entry of expandGlob(glob)) {
    const contents = await Deno.readTextFile(entry.path)
    lang.read(contents)
  }
}

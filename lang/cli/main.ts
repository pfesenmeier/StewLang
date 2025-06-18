import { parseArgs } from "@std/cli/parse-args";
import { StewLang } from "../sdk/main.ts";
import { extname } from "jsr:@std/path";

const stewLangExt = ".sw";

const args = parseArgs(Deno.args);
const lang = new StewLang();

async function main() {
  if (args.h || args.help) {
    console.log("help message");
    return;
  }

  let input: string = "";
  for (const file of args._) {
    const fileName = file.toString();
    if (extname(fileName) !== stewLangExt) {
      throw new Error(`${fileName} does not end in "${stewLangExt}`);
    }

    input += await Deno.readTextFile(fileName);
    input += "\n";
  }

  const output = lang.read(input);

  console.log(output);
}

try {
  await main();
} catch (e) {
  console.log((e as Error).message);
}

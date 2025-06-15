import { parseArgs as parseDenoArgs } from "@std/cli";

export async function parseArgs() {
  const args = parseDenoArgs(Deno.args, {});

  // TODO accept list of files
  
  const rootDir = await parseFolder(args._)

  return {
    rootDir,
  }
}

async function parseFolder(args: (string | number)[]) {
  if (args.length > 1 ) {
    console.log(help)
    Deno.exit(1)
  }

  const arg = args.at(0) ?? "."

  const folder = await Deno.lstat(arg.toString())

  if (!folder.isDirectory) {
    console.log(help)
    Deno.exit(1)
  }

  return arg as string
}

const help = `
Usage: stew <folder>
`

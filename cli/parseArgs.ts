import { parseArgs as parseDenoArgs } from "@std/cli";

export async function parseArgs() {
  const args = parseDenoArgs(Deno.args, {
    boolean: ["debug"],
  });

  const defaults = {
      debug: args.debug,
      command: "run" as const,
      rootDir: "."
  }

  if (args._.length === 0) return defaults

  if (args._.length === 1) {
    return {
      ...defaults,
      command: args._[0].toString()
    }
  }

  // TODO list of files
  const [command, ...folders] = args._
  
  const rootDir = await parseFolder(folders);

  return {
    ...defaults,
    command,
    rootDir,
  };
}

async function parseFolder(args: (string | number)[]) {
  if (args.length > 1) {
    console.log(help);
    Deno.exit(1);
  }

  const arg = args.at(0) ?? ".";

  const folder = await Deno.lstat(arg.toString());

  if (!folder.isDirectory) {
    console.log(help);
    Deno.exit(1);
  }

  return arg as string;
}

const help = `
Usage: stew [<run|check>] [<folder>]
`;

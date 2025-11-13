import { parseArgs as parseDenoArgs } from "@std/cli";

export const commands = {
  run: "run",
  check: "check",
} as const

function parseCommand(arg: string) {
  const dict: Record<string, keyof typeof commands | undefined> = commands
  
  return dict[arg]
}

export async function parseArgs() {
  const args = parseDenoArgs(Deno.args, {
    boolean: ["debug", "folder"],
    string: "_",
    default: {
      _: ["run", "."],
    },
  });

  const [commandArg, ...folders] = args._;

  const command = parseCommand(commandArg)

  if (!command) {
    console.log(help);
    Deno.exit(1);
  }

  const rootDir = await parseFolder(folders);

  return {
    debug: args.debug,
    command,
    rootDir,
  };
}

async function parseFolder(args: string[]) {
  // TODO list of files
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

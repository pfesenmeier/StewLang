#! /usr/bin/env deno

import { render } from "./render.tsx";
import { parseArgs } from "./parseArgs.ts";
import { check } from "./commands/check.ts";

if (import.meta.main) {
  const args = await parseArgs();

  if (args.command === "check") {
    await check(args.rootDir)
  }

  console.clear();
  render(args);
}

#! /usr/bin/env deno

import { render } from "./render.tsx";
import { parseArgs } from "./parseArgs.ts";

if (import.meta.main) {
  const args = await parseArgs();

  render(args.rootDir);
}

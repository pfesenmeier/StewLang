import fs from "node:fs";
import { argv } from "node:process";
import { Scanner } from "./scanner.ts";

try {
  // expected to be called node --import=tsx stewlang.ts
  console.log(argv);
  const file = argv[2];
  const data = fs.readFileSync(file);

  const scanner = new Scanner(data.toString());
  scanner.scan();

  const tokens = scanner.getTokens();
  tokens.forEach(console.log);
} catch (err) {
  console.error(err);
}

import fs from 'node:fs';
import { argv } from 'node:process';
import { Scanner } from './scanner';


try {
    // expected to be called node --import=tsx stewlang.ts 
    var file = argv[2]; 
    const data = fs.readFileSync(file);

    const scanner = new Scanner();
    scanner.scan(data.toString());

    var tokens = scanner.getTokens();
    tokens.forEach(console.log);
} catch (err) {
    console.error(err);
}

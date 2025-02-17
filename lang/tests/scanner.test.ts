import { assertEquals } from "jsr:@std/assert";
import { Scanner, Token, TokenType } from "../scanner/scanner.ts";

const scanner = new Scanner();

Deno.test("Can parse empty string", () => {
    const input = "";
    const output = Array.from(scanner.scan(input))
    assertEquals(output, []);
});

Deno.test("Can parse one word", () => {
    const input = "foo-bar";
    const output = Array.from(scanner.scan(input))[0]
    assertEquals(output, new Token(TokenType.WORD, input));
});

Deno.test("Can parse two words", () => {
    const input = "foo bar";
    const output = Array.from(scanner.scan(input))
    assertEquals(output[0], new Token(TokenType.WORD, "foo"));
    assertEquals(output[1], new Token(TokenType.WORD, "bar"));
});

Deno.test("Can parse braces", () => {
    const input = "pbj ( jelly peanut-butter )";
    const output = Array.from(scanner.scan(input))
    assertEquals(
        output,
        [
            new Token(TokenType.WORD, "pbj"),
            new Token(TokenType.LEFT_PARENS, "("),
            new Token(TokenType.WORD, "jelly"),
            new Token(TokenType.WORD, "peanut-butter"),
            new Token(TokenType.RIGHT_PARENS, ")"),
        ],
    );
});

Deno.test("Can parse newlines", () => {
    const input = `
pbj ( 
  jelly
  peanut-butter
)`.trim();
    const output = Array.from(scanner.scan(input))
    assertEquals(
        output,
        [
            new Token(TokenType.WORD, "pbj"),
            new Token(TokenType.LEFT_PARENS, "("),
            new Token(TokenType.NEWLINE, "\n"),
            new Token(TokenType.WORD, "jelly"),
            new Token(TokenType.NEWLINE, "\n"),
            new Token(TokenType.WORD, "peanut-butter"),
            new Token(TokenType.NEWLINE, "\n"),
            new Token(TokenType.RIGHT_PARENS, ")"),
        ],
    );
});

Deno.test("Can parse - character", () => {
    const input = `
dip (
  pita
  hummus
  - arrange on plate
)`.trim();
    const output = Array.from(scanner.scan(input))
    assertEquals(
        output,
        [
            new Token(TokenType.WORD, "dip"),
            new Token(TokenType.LEFT_PARENS, "("),
            new Token(TokenType.NEWLINE, "\n"),
            new Token(TokenType.WORD, "pita"),
            new Token(TokenType.NEWLINE, "\n"),
            new Token(TokenType.WORD, "hummus"),
            new Token(TokenType.NEWLINE, "\n"),
            new Token(TokenType.DASH, "-"),
            new Token(TokenType.WORD, "arrange"),
            new Token(TokenType.WORD, "on"),
            new Token(TokenType.WORD, "plate"),
            new Token(TokenType.NEWLINE, "\n"),
            new Token(TokenType.RIGHT_PARENS, ")"),
        ],
    );
});

Deno.test("Can handle windows newlines", () => {
    const input = "hello\r\nworld";
    const output = Array.from(scanner.scan(input))
    assertEquals(output, [
        new Token(TokenType.WORD, "hello"),
        new Token(TokenType.NEWLINE, "\r\n"),
        new Token(TokenType.WORD, "world"),
    ]);
});

Deno.test("Can parse identifier", () => {
    const input = "@foo";
    const output = Array.from(scanner.scan(input))
    assertEquals(output, [new Token(TokenType.IDENTIFIER, input)]);
});

Deno.test("Can parse amount", () => {
    const input = "1/2c"
    const output = Array.from(scanner.scan(input))
    assertEquals(output, [new Token(TokenType.AMOUNT, "1/2c")])
})

Deno.test("Can parse recipe meta", () => {
    const input = "$title Cauliflower Parmesean"
    const output = Array.from(scanner.scan(input))
    assertEquals(output,[
        new Token(TokenType.META, "$title"),
        new Token(TokenType.WORD, "Cauliflower"),
        new Token(TokenType.WORD, "Parmesean"),
    ])
})

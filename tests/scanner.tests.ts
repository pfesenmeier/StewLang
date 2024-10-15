import { assertEquals } from "jsr:@std/assert";
import { Scanner, Token, TokenType } from "../scanner.ts";

const scanner = new Scanner();

Deno.test("Can parse empty string", () => {
    const input = "";
    const output = scanner.scan(input).toArray();
    assertEquals(output, []);
});

Deno.test("Can parse one word", () => {
    const input = "foo-bar";
    const output = scanner.scan(input).toArray();
    assertEquals(output[0], new Token(TokenType.WORD, input));
});

Deno.test("Can parse two words", () => {
    const input = "foo bar";
    const output = scanner.scan(input).toArray();
    assertEquals(output[0], new Token(TokenType.WORD, "foo"));
    assertEquals(output[1], new Token(TokenType.WORD, "bar"));
});

Deno.test("Can parse braces", () => {
    const input = "pbj { jelly peanut-butter }"
    const output = scanner.scan(input).toArray();
    assertEquals(
        output,
        [
            new Token(TokenType.WORD, "pbj"),
            new Token(TokenType.LEFT_CURLY_BRACE, "{"),
            new Token(TokenType.WORD, "jelly"),
            new Token(TokenType.WORD, "peanut-butter"),
            new Token(TokenType.RIGHT_CURLY_BRACE, "}"),
        ]
    )
});

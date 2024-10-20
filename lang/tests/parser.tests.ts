import { assertEquals } from "jsr:@std/assert/equals";
import { Parser } from "../parser/parser.ts";
import { Token, TokenType } from "../scanner/scanner.ts";
import { Recipe } from "../parser/recipe.ts";

Deno.test("handles empty recipe", () => {
    const input = [
        new Token(TokenType.WORD, "pbj"),
        new Token(TokenType.LEFT_PARENS, "("),
        new Token(TokenType.RIGHT_PARENS, ")"),
    ]
    const output = Array.from(new Parser(input).parse())
    assertEquals(output, [new Recipe("pbj")])
})

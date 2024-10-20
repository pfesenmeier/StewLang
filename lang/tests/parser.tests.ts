import { assertEquals } from "jsr:@std/assert/equals";
import { Parser } from "../parser/parser.ts";
import { Token, TokenType } from "../scanner/scanner.ts";
import { Recipe } from "../parser/recipe.ts";
import { Ingredient } from "../parser/ingredient.ts";

Deno.test("handles one ingredient", () => {
    const input = [
        new Token(TokenType.WORD, "pbj"),
    ];
    const output = new Parser(input).parse();
    assertEquals(output, new Recipe([new Ingredient(["pbj"])]));
})

Deno.test("handles empty recipe", () => {
    const input = [
        new Token(TokenType.WORD, "pbj"),
        new Token(TokenType.LEFT_PARENS, "("),
        new Token(TokenType.RIGHT_PARENS, ")"),
    ];
    const output = new Parser(input).parse();
    assertEquals(output, new Recipe([new Ingredient(["pbj"])]));
});

Deno.test("handles ingredient with sub-ingredients", () => {
    const input = [
        new Token(TokenType.WORD, "pbj"),
        new Token(TokenType.LEFT_PARENS, "("),
        new Token(TokenType.WORD, "jelly"),
        new Token(TokenType.RIGHT_PARENS, ")"),
    ];
    const output = new Parser(input).parse();
    assertEquals(
        output,
        new Recipe([
            new Ingredient(["pbj"], undefined, [new Ingredient(["jelly"])]),
        ]),
    );
});

Deno.test("handles ingredient with amount", () => {
    // const input = [
    //     new Token(TokenType.AMOUNT, "pbj"),
    //     new Token(TokenType.LEFT_PARENS, "("),
    //     new Token(TokenType.WORD, "jelly"),
    //     new Token(TokenType.RIGHT_PARENS, ")"),
    // ];
    // const output = new Parser(input).parse();
    // assertEquals(
    //     output,
    //     new Recipe([
    //         new Ingredient(["pbj"], undefined, [new Ingredient(["jelly"])]),
    //     ]),
    // );
})

// ingredient with multiple words
// ingredient with amount

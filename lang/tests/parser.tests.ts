import { assertEquals } from "jsr:@std/assert/equals";
import { Parser } from "../parser/parser.ts";
import { Token, TokenType } from "../scanner/scanner.ts";
import { Recipe } from "../parser/recipe.ts";
import { Ingredient } from "../parser/ingredient.ts";
import { Amount } from "../scanner/amount.ts";

Deno.test("handles one ingredient", () => {
    const input = [
        new Token(TokenType.WORD, "pbj"),
    ];
    const output = new Parser(input).parse();
    assertEquals(output, new Recipe([new Ingredient(["pbj"])]));
});

Deno.test("handles empty recipe", () => {
    const input = [
        new Token(TokenType.WORD, "pbj"),
        new Token(TokenType.LEFT_PARENS, "("),
        new Token(TokenType.RIGHT_PARENS, ")"),
    ];
    const output = new Parser(input).parse();
    assertEquals(output, new Recipe([new Ingredient(["pbj"])]));
});

Deno.test("handles ingredient with two names", () => {
    const input = [
        new Token(TokenType.WORD, "AP"),
        new Token(TokenType.WORD, "flour"),
    ];
    const output = new Parser(input).parse();
    assertEquals(output, new Recipe([new Ingredient(["AP", "flour"])]));
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
    const input = [
        new Token(TokenType.WORD, "pbj"),
        new Token(TokenType.LEFT_PARENS, "("),
        new Token(TokenType.AMOUNT, "2T"),
        new Token(TokenType.WORD, "jelly"),
        new Token(TokenType.RIGHT_PARENS, ")"),
    ];
    const output = new Parser(input).parse();
    assertEquals(
        output,
        new Recipe([
            new Ingredient(["pbj"], undefined, [
                new Ingredient(["jelly"], new Amount(2, "TBSP")),
            ]),
        ]),
    );
});

Deno.test("handles nested recipe", () => {
    const input = [
        new Token(TokenType.WORD, "pita"),
        new Token(TokenType.WORD, "pockets"),
        new Token(TokenType.LEFT_PARENS, "("),
        new Token(TokenType.WORD, "hummus"),
        new Token(TokenType.LEFT_PARENS, "("),
        new Token(TokenType.WORD, "chickpeas"),
        new Token(TokenType.RIGHT_PARENS, ")"),
        new Token(TokenType.RIGHT_PARENS, ")"),
    ];
    const output = new Parser(input).parse();
    assertEquals(
        output,
        new Recipe([
            new Ingredient(["pita", "pockets"], undefined, [
                new Ingredient(["hummus"], undefined, [
                    new Ingredient(["chickpeas"]),
                ]),
            ]),
        ]),
    );
});

Deno.test("handles steps", () => {
})

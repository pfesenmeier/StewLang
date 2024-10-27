import { assertEquals } from "jsr:@std/assert/equals";
import { Parser } from "../parser/parser.ts";
import { Token, TokenType } from "../scanner/scanner.ts";
import { Recipe } from "../parser/recipe.ts";
import { Ingredient } from "../parser/ingredient.ts";
import { Amount } from "../scanner/amount.ts";
import { Step } from "../parser/step.ts";
import { Identifier } from "../parser/identifier.ts";

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
    const input = [
        new Token(TokenType.WORD, "potatoes"),
        new Token(TokenType.LEFT_PARENS, "("),
        new Token(TokenType.DASH, "-"),
        new Token(TokenType.WORD, "boil"),
        new Token(TokenType.RIGHT_PARENS, ")"),
    ];

    const output = new Parser(input).parse();

    assertEquals(
        output,
        new Recipe([
            new Ingredient(["potatoes"], undefined, [
                new Step(["boil"]),
            ]),
        ]),
    );
});

Deno.test("handles trailing newline separated list of ingredients", () => {
    const input = [
        new Token(TokenType.WORD, "potatoes"),
        new Token(TokenType.NEWLINE, "\n"),
        new Token(TokenType.WORD, "cream"),
        new Token(TokenType.NEWLINE, "\n"),
        new Token(TokenType.WORD, "butter"),
        new Token(TokenType.NEWLINE, "\n"),
    ];

    const output = new Parser(input).parse();

    assertEquals(
        output,
        new Recipe([
            new Ingredient(["potatoes"], undefined),
            new Ingredient(["cream"], undefined),
            new Ingredient(["butter"], undefined),
        ]),
    );
});

Deno.test("handles newline separated list of ingredients", () => {
    const input = [
        new Token(TokenType.WORD, "potatoes"),
        new Token(TokenType.NEWLINE, "\n"),
        new Token(TokenType.WORD, "cream"),
        new Token(TokenType.NEWLINE, "\n"),
        new Token(TokenType.WORD, "butter"),
    ];

    const output = new Parser(input).parse();

    assertEquals(
        output,
        new Recipe([
            new Ingredient(["potatoes"], undefined),
            new Ingredient(["cream"], undefined),
            new Ingredient(["butter"], undefined),
        ]),
    );
});

Deno.test("handles full example", () => {
    const input = [
        new Token(TokenType.WORD, "potato"),
        new Token(TokenType.WORD, "soup"),
        new Token(TokenType.LEFT_PARENS, "("),
        new Token(TokenType.NEWLINE, "\n"),
        new Token(TokenType.AMOUNT, "2lb"),
        new Token(TokenType.WORD, "potatoes"),
        new Token(TokenType.NEWLINE, "\n"),
        new Token(TokenType.WORD, "stock"),
        new Token(TokenType.NEWLINE, "\n"),
        new Token(TokenType.WORD, "cream"),
        new Token(TokenType.NEWLINE, "\n"),
        new Token(TokenType.DASH, "-"),
        new Token(TokenType.WORD, "boil"),
        new Token(TokenType.WORD, "potatoes"),
        new Token(TokenType.NEWLINE, "\n"),
        new Token(TokenType.RIGHT_PARENS, ")"),
    ];

    const output = new Parser(input).parse();

    assertEquals(
        output,
        new Recipe([
            new Ingredient(["potato", "soup"], undefined, [
                new Ingredient(["potatoes"], new Amount(2, "LB")),
                new Ingredient(["stock"]),
                new Ingredient(["cream"]),
                new Step(["boil", "potatoes"]),
            ]),
        ]),
    );
});

Deno.test("handles identifiers", () => {
  const input = [
        new Token(TokenType.WORD, "batter"),
        new Token(TokenType.LEFT_PARENS, "("),
        new Token(TokenType.DASH, "-"),
        new Token(TokenType.WORD, "mix"),
        new Token(TokenType.IDENTIFIER, "@dry"),
        new Token(TokenType.RIGHT_PARENS, ")"),
    ]

    const output = new Parser(input).parse();

    assertEquals(
        output,
        new Recipe([
            new Ingredient(["batter"], undefined, [
                new Step([
                    "mix",
                    new Identifier("dry")
                ])
            ])
        ])
    )
})

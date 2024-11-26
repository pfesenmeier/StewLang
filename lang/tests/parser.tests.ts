import { assertEquals } from "jsr:@std/assert/equals";
import { Parser } from "../parser/parser.ts";
import { Token, TokenType } from "../scanner/scanner.ts";
import { Recipe } from "../parser/recipe.ts";
import { Ingredient } from "../parser/ingredient.ts";
import { Amount } from "../scanner/amount.ts";
import { Step } from "../parser/step.ts";
import { Identifier } from "../parser/identifier.ts";

Deno.test("handles one ingredient", () => {
  const input = [new Token(TokenType.WORD, "pbj")];
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
      new Ingredient(["pbj"], {
        detail: [new Ingredient(["jelly"], { id: "pbj:jelly" })],
      }),
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
      new Ingredient(["pbj"], {
        detail: [
          new Ingredient(["jelly"], {
            amount: new Amount(2, "TBSP"),
            id: "pbj:jelly",
          }),
        ],
      }),
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
      new Ingredient(["pita", "pockets"], {
        detail: [
          new Ingredient(["hummus"], {
            detail: [
              new Ingredient(["chickpeas"], {
                id: "pita-pockets:hummus:chickpeas",
              }),
            ],
            id: "pita-pockets:hummus",
          }),
        ],
      }),
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
      new Ingredient(["potatoes"], {
        detail: [new Step(["boil"])],
      }),
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
      new Ingredient(["potato", "soup"], {
        detail: [
          new Ingredient(["potatoes"], {
            amount: new Amount(2, "LB"),
            id: "potato-soup:potatoes",
          }),
          new Ingredient(["stock"], { id: "potato-soup:stock" }),
          new Ingredient(["cream"], { id: "potato-soup:cream" }),
          new Step(["boil", "potatoes"]),
        ],
      }),
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
  ];

  const output = new Parser(input).parse();

  assertEquals(
    output,
    new Recipe([
      new Ingredient(["batter"], {
        detail: [new Step(["mix", new Identifier("@dry")])],
      }),
    ]),
  );
});

Deno.test("handles meta", () => {
  const input = [
    new Token(TokenType.META, "$title"),
    new Token(TokenType.WORD, "my"),
    new Token(TokenType.WORD, "grandmother's"),
    new Token(TokenType.WORD, "recipe"),
  ];

  const output = new Parser(input).parse();

  assertEquals(output, new Recipe([], { $title: "my grandmother's recipe" }));
});

Deno.test("handles meta and ingredients", () => {
  const input = [
    new Token(TokenType.META, "$title"),
    new Token(TokenType.WORD, "my"),
    new Token(TokenType.WORD, "grandmother's"),
    new Token(TokenType.WORD, "recipe"),
    new Token(TokenType.NEWLINE, "\n"),
    new Token(TokenType.WORD, "ingredient"),
  ];

  const output = new Parser(input).parse();

  assertEquals(
    output,
    new Recipe([new Ingredient(["ingredient"])], {
      $title: "my grandmother's recipe",
    }),
  );
});

Deno.test("handles multiple metas", () => {
  const input = [
    new Token(TokenType.META, "$foo"),
    new Token(TokenType.WORD, "bar"),
    new Token(TokenType.NEWLINE, "\n"),
    new Token(TokenType.META, "$far"),
    new Token(TokenType.WORD, "bing"),
  ];

  const output = new Parser(input).parse();

  assertEquals(output, new Recipe([], { $foo: "bar", $far: "bing" }));
});

Deno.test("passes parent ingredients to their children", () => {
  const input = [
    new Token(TokenType.WORD, "batter"),
    new Token(TokenType.LEFT_PARENS, "("),
    new Token(TokenType.WORD, "flour"),
    new Token(TokenType.RIGHT_PARENS, ")"),
  ];

  const output = new Parser(input).parse();

  const child = output.ingredients.at(0)?.detail?.at(0) as Ingredient;

  assertEquals(child.id, "batter:flour");
});

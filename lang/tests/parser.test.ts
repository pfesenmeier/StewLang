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
  assertEquals(output, { ingredients: [{ name: ["pbj"] }] });
});

Deno.test("handles empty token list", () => {
  const input: Token[] = [];
  const output = new Parser(input).parse();
  assertEquals(output, { ingredients: [] });
});

Deno.test("handles beginning newlines", () => {
  const input: Token[] = [new Token(TokenType.NEWLINE, "\n")];
  const output = new Parser(input).parse();
  assertEquals(output, { ingredients: [] });
});

Deno.test("handles empty recipe", () => {
  const input = [
    new Token(TokenType.WORD, "pbj"),
    new Token(TokenType.LEFT_PARENS, "("),
    new Token(TokenType.RIGHT_PARENS, ")"),
  ];
  const output = new Parser(input).parse();
  assertEquals(output, { ingredients: [{ name: ["pbj"] }] });
});

Deno.test("handles ingredient with two names", () => {
  const input = [
    new Token(TokenType.WORD, "AP"),
    new Token(TokenType.WORD, "flour"),
  ];
  const output = new Parser(input).parse();
  assertEquals(output, { ingredients: [{ name: ["AP", "flour"] }] });
});

Deno.test("handles ingredient with sub-ingredients", () => {
  const input = [
    new Token(TokenType.WORD, "pbj"),
    new Token(TokenType.LEFT_PARENS, "("),
    new Token(TokenType.WORD, "jelly"),
    new Token(TokenType.RIGHT_PARENS, ")"),
  ];
  const output = new Parser(input).parse();
  assertEquals(output, {
    ingredients: [
      {
        name: ["pbj"],
        ingredients: [
          {
            name: ["jelly"],
          },
        ],
      },
    ],
  });
});

Deno.test("handles ingredient with amount", () => {
  const input = [
    new Token(TokenType.WORD, "pbj"),
    new Token(TokenType.LEFT_PARENS, "("),
    new Token(TokenType.WORD, "2T"),
    new Token(TokenType.WORD, "jelly"),
    new Token(TokenType.RIGHT_PARENS, ")"),
  ];
  const output = new Parser(input).parse();
  assertEquals(output, {
    ingredients: [
      {
        name: ["pbj"],
        ingredients: [
          {
            name: ["jelly"],
            amount: {
              amount: 2,
              unit: "TBSP",
            },
          },
        ],
      },
    ],
  });
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
  assertEquals(output, {
    ingredients: [
      {
        name: ["pita", "pockets"],
        ingredients: [
          {
            name: ["hummus"],
            ingredients: [
              {
                name: ["chickpeas"],
              },
            ],
          },
        ],
      },
    ],
  });
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

  assertEquals(output, {
    ingredients: [
      {
        name: ["potatoes"],
        steps: [
          {
            text: ["boil"],
          },
        ],
      },
    ],
  });
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

  assertEquals(output, {
    ingredients: [
      { name: ["potatoes"] },
      { name: ["cream"] },
      { name: ["butter"] },
    ],
  });
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

  assertEquals(output, {
    ingredients: [
      { name: ["potatoes"] },
      { name: ["cream"] },
      { name: ["butter"] },
    ],
  });
});

Deno.test("handles full example", () => {
  const input = [
    new Token(TokenType.WORD, "potato"),
    new Token(TokenType.WORD, "soup"),
    new Token(TokenType.LEFT_PARENS, "("),
    new Token(TokenType.NEWLINE, "\n"),
    new Token(TokenType.WORD, "2lb"),
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

  assertEquals(output, {
    ingredients: [
      {
        name: ["potato", "soup"],
        ingredients: [
          {
            name: ["potatoes"],
            amount: {
              amount: 2,
              unit: "LB",
            },
          },
          { name: ["stock"] },
          { name: ["cream"] },
        ],
        steps: [{ text: ["boil", "potatoes"] }],
      },
    ],
  });
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

  assertEquals(output, {
    ingredients: [
      {
        name: ["batter"],
        steps: [
          {
            text: ["mix", { name: "@dry" }],
          },
        ],
      },
    ],
  });
});

Deno.test("handles meta", () => {
  const input = [
    new Token(TokenType.META, "$title"),
    new Token(TokenType.WORD, "my"),
    new Token(TokenType.WORD, "grandmother's"),
    new Token(TokenType.WORD, "recipe"),
  ];

  const output = new Parser(input).parse();

  assertEquals(output, {
    ingredients: [],
    meta: { $title: "my grandmother's recipe" },
  });
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

  assertEquals(output, {
    ingredients: [{ name: ["ingredient"]} ],
    meta: { $title: "my grandmother's recipe" },
  });
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

  assertEquals(output, {
    ingredients: [],
    meta: { $foo: "bar", $far: "bing" },
  });
});

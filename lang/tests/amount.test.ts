import { assertEquals } from "jsr:@std/assert/equals";
import { parseAmount } from "../scanner/amount.ts";

Deno.test("it handles fractions", () => {
  const input = "1/2c";
  const { amount, unit } = parseAmount(input)!;
  assertEquals(unit, "CUP");
  assertEquals(amount, 0.5);
});

Deno.test("it handles _", () => {
  const input = "1_pinch";
  const { amount, unit } = parseAmount(input)!;
  assertEquals(unit, "PINCH");
  assertEquals(amount, 1);
});

Deno.test("it handles decimals", () => {
  const input = "0.25tsp";
  const { amount, unit } = parseAmount(input)!;
  assertEquals(unit, "TSP");
  assertEquals(amount, 0.25);
});

Deno.test("it handles 2T", () => {
  const input = "2T";
  const { amount, unit } = parseAmount(input)!;
  assertEquals(unit, "TBSP");
  assertEquals(amount, 2);
});

const tablespoon = [
  "1tbsp",
  "1TBSP",
  "1T",
  "1_T",
  "1_tbsp",
  "1.0T",
  "1.0tbsp",
  "1.0000tbsp",
  "01Tbsp",
];

Deno.test("it handles tablespoon", () => {
  for (const input of tablespoon) {
    const { amount, unit } = parseAmount(input)!;
    assertEquals(unit, "TBSP");
    assertEquals(amount, 1);
  }
});

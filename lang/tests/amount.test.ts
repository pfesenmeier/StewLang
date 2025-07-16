import { assertEquals } from "jsr:@std/assert/equals";
import { parseAmount, UnitType } from "../scanner/amount.ts";

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
  "1/1tbsp",
];

Deno.test("it handles tablespoon", () => {
  for (const input of tablespoon) {
    const { amount, unit } = parseAmount(input)!;
    assertEquals(unit, UnitType.tablespoon);
    assertEquals(amount, 1);
  }
});

Deno.test("it handles fractions", () => {
  const input = "1/2c";
  const { amount, unit } = parseAmount(input)!;
  assertEquals(unit, UnitType.cup);
  assertEquals(amount, 0.5);
});

Deno.test("it handles _", () => {
  const input = "1_inch";
  const { amount, unit } = parseAmount(input)!;
  assertEquals(unit, UnitType.inch);
  assertEquals(amount, 1);
});

Deno.test("it handles decimals", () => {
  const input = "0.25tsp";
  const { amount, unit } = parseAmount(input)!;
  assertEquals(unit, UnitType.teaspoon);
  assertEquals(amount, 0.25);
});

Deno.test("it handles fractions", () => {
  const input = "1/2tsp";
  const { amount, unit } = parseAmount(input)!;
  assertEquals(unit, UnitType.teaspoon);
  assertEquals(amount, 0.5);
})

Deno.test("it handles numbers without units", () => {
  const input = "4";
  const { amount, unit } = parseAmount(input)!;
  assertEquals(unit, undefined);
  assertEquals(amount, 4);
})

Deno.test("it parses unknown units as strings", () => {
  const input = "1pinch";
  const { amount, unit } = parseAmount(input)!;
  assertEquals(unit, "pinch");
  assertEquals(amount, 1);
})

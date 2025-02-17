import { assertEquals } from "jsr:@std/assert/equals";
import { Amount } from "../scanner/amount.ts";

Deno.test("it handles fractions", () => {
    const input = "1/2c"
    const amount = Amount.fromString(input)
    assertEquals(amount.unit, "CUP")
    assertEquals(amount.amount, 0.5)
})

Deno.test("it handles -", () => {
    const input = "1-pinch"
    const amount = Amount.fromString(input)
    assertEquals(amount.unit, "PINCH")
    assertEquals(amount.amount, 1)
})

Deno.test("it handles decimals", () => {
    const input = "0.25tsp"
    const amount = Amount.fromString(input)
    assertEquals(amount.unit, "TSP")
    assertEquals(amount.amount, 0.25)
})

Deno.test("it handles 2T", () => {
    const input = "2T"
    const amount = Amount.fromString(input)
    assertEquals(amount.unit, "TBSP")
    assertEquals(amount.amount, 2)
})

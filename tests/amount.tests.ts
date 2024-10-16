import { assertEquals } from "jsr:@std/assert/equals";
import { Amount } from "../amount.ts";

Deno.test("it handles fractions", () => {
    const input = "1/2c"
    const amount = new Amount(input)
    assertEquals(amount.unit, "CUP")
    assertEquals(amount.amount, 0.5)
})

Deno.test("it handles -", () => {
    const input = "1-pinch"
    const amount = new Amount(input)
    assertEquals(amount.unit, "PINCH")
    assertEquals(amount.amount, 1)
})

Deno.test("it handles decimals", () => {
    const input = "0.25tsp"
    const amount = new Amount(input)
    assertEquals(amount.unit, "TSP")
    assertEquals(amount.amount, 0.25)
})

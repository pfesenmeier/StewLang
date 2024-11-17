import { describe, it } from "vitest"
import { useRecipeBook } from "./useRecipeBook"

describe("useRecipeBookTests", () => {
  it("handles empty recipe", () => {
    const book = useRecipeBook()
  })
})

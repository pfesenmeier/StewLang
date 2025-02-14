import { expect, vi, describe, it } from 'vitest'
import { useRecipeBook } from './useRecipeBook'
import { beforeEach } from 'node:test'
import { ref } from 'vue'
import { useRecipesFromSearchParams as mocked } from './useRecipesFromSearchParams'

const useRecipesFromSearchParams = vi.mocked(mocked)
vi.mock('./useRecipesFromSearchParams')

describe('useRecipeBookTests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('handles empty recipe list', () => {
    useRecipesFromSearchParams.mockReturnValue({ recipes: ref([]) })
    const book = useRecipeBook()
    expect(book.recipes.value).toStrictEqual([])
  })

  it('handles a single recipe', () => {
    useRecipesFromSearchParams.mockReturnValue({
      recipes: ref(['peanut butter\njelly\n'])
    })
    const book = useRecipeBook()
    expect(book.recipes.value).toHaveLength(1)
    expect(book.recipes.value.at(0)?.__brand).toBe('Recipe')
  })
})

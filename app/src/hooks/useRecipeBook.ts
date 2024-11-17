import { useRoute } from 'vue-router'
import { StewLang } from '@/lang'
export function useRecipeBook() {
  const recipes = useRecipesFromSearchParams()
  const lang = new StewLang()

  return recipes.map(lang.read)
}

export function useRecipesFromSearchParams(): string[] {
  const route = useRoute()
  const recipes = route.query["recipes"]

  if (recipes === null) return []

  if (typeof recipes === "string") {
    return [recipes]
  }

  return recipes.filter(r => r !== null)
}

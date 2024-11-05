import { useRoute } from 'vue-router'
export function useRecipeBook() {
  const route = useRoute()
  const recipes = route.query["recipes"]

  if (recipes === null) return []

  if (typeof recipes === "string") {
    return [recipes]
  }
  return recipes

}

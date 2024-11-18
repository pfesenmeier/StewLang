import { computed } from "vue";
import { useRoute } from "vue-router";
import type { RecipeBookPersistenceHook } from "./useRecipeBook";

export const useRecipesFromSearchParams: RecipeBookPersistenceHook = () => {
  const route = useRoute();
  const recipes = computed(() => {
    const recipeQuery = route.query["recipes"]
    let list: string[] = []

    if (typeof recipeQuery === "string") {
      list.push(recipeQuery)
    } else if (recipeQuery !== null) {
      list = recipeQuery.filter(r => r !== null)
    }

    return list
  });

  return { recipes }
}


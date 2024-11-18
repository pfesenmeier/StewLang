import { ref } from 'vue'
import type { RecipeBookPersistenceHook } from './useRecipeBook'

export const useRecipesHardCoded: RecipeBookPersistenceHook = () => {
  return {
    recipes: ref([
      `pbj,
       jelly`,
    ]),
  }
}

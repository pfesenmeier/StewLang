import { StewLang } from 'stew-lang'
import { useRecipesFromSearchParams } from './useRecipesFromSearchParams'
import { computed, type Ref } from 'vue'
import { useRecipesHardCoded } from './useRecipesHardCoded'

export type RecipeBookPersistenceHook = () => { recipes: Ref<string[]> }

export function useRecipeBookFake() {
  const lang = new StewLang()
  const fakeRecipes = useRecipesHardCoded()
  return { recipes: computed(() => fakeRecipes.recipes.value.map(lang.read)) }
}

export function useRecipeBook() {
  const { recipes } = useRecipesFromSearchParams()
  const lang = new StewLang()

  return { recipes: computed(() => recipes.value.map(lang.read)) }
}

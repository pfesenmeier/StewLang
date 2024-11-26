import { StewLang } from 'stew-lang'
import { useRecipesFromSearchParams } from './useRecipesFromSearchParams'
import { computed, type Ref } from 'vue'

export type RecipeBookPersistenceHook = () => { recipes: Ref<string[]> }

export function useRecipeBookFake() {
  const lang = new StewLang()

  const recipes = [
    `$name Peanut Butter Sandwich Made With Jam
     sandwich (
       Peanut Butter
       jam
       Bread
       - spread @jam ff sake
     )`,
  ]

  return { recipes: computed(() => recipes.map(r => lang.read(r))) }
}

export function useRecipeBook() {
  const { recipes } = useRecipesFromSearchParams()
  const lang = new StewLang()

  return { recipes: computed(() => recipes.value.map(lang.read)) }
}

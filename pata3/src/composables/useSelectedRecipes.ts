import { ref } from "vue";

const selectedRecipes = ref<string[]>([])

export function useSelectedRecipes() {
  return {
    selectedRecipes
  }
}

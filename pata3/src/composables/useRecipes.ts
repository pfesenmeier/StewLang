import { ref } from "vue";

// useRecipes
export function useRecipes() {
  return {
    recipes: ref(null)
  }
}

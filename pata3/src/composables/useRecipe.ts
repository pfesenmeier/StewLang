import { computed, toValue, type MaybeRef } from "vue";
import { useFileSystem } from "./useFileSystem";

export function useRecipe(fileName: MaybeRef<string>) {
  const { readFile } = useFileSystem();

  const recipe = computed(async () => {
    const file = await readFile(toValue(fileName)); 

    if (!file) return
    
  })



}

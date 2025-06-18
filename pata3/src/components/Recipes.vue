<template>
  <h2>Recipes</h2>
  <nav>
    <div v-if="!folderIsOpen && !isLoading">
      <button @click="openFolder">Open Folder</button>
    </div>
    <ul v-else>
      <li v-for="recipe in files" :key="recipe.name"
        @click="selectRecipe(recipe.name)"
:class="{
  'bg-gray': selectedRecipes.includes(recipe.name),
}"
      >{{ recipe.name }}</li>
    </ul>
  </nav>
</template>
<script setup lang="ts">
import { useFileSystem } from "../composables/useFileSystem";
import { useSelectedRecipes } from "../composables/useSelectedRecipes";

const { selectedRecipes } = useSelectedRecipes();

function selectRecipe(recipe: string) {
  if (selectedRecipes.value.includes(recipe)) {
    selectedRecipes.value = []
    // TODO
    //selectedRecipes.value = selectedRecipes.value.filter((r) => r !== recipe);
  } else {
    selectedRecipes.value = [recipe];
    //selectedRecipes.value.push(recipe);
  }
}

const { openFolder, folderIsOpen, files, isLoading } = useFileSystem();
</script>
<style>
.bg-gray {
  background-color: #f0f0f0;
}

button {
  padding: 8px 16px;
  white-space: nowrap;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

li {
  padding: 8px 16px;
  cursor: pointer;
  text-wrap: nowrap;
}
</style>

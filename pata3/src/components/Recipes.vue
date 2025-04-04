<template>
  <h2>Recipes</h2>
  <nav>
    <div v-if="!folderIsOpen">
      <button @click="openFolder">Open Folder</button>
    </div>
    <ul v-else>
      <li v-for="recipe in files" :key="recipe.name">{{ recipe.name }}</li>
    </ul>
  </nav>
</template>
<script setup lang="ts">
import { useFileSystem } from "../composables/useFileSystem";

const { openFolder, folderIsOpen, files } = useFileSystem();
</script>
<style>
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
</style>

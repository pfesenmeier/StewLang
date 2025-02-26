<template>
  <section>
    <h1>Pata</h1>
    welcome to Pata.
    <h2>TODOS</h2>
    <ol>
      <li>editor</li>
      <li>composer</li>
    </ol>
  </section>
  <section id="start">
    <div>Create New Folder</div>
    <div>Open Existing Folder</div>
    <div>Create New Recipe</div>
    <div>Compose New Meal</div>
  </section>
</template>
<style scoped>
section {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
<script setup lang="ts">
import { ref } from 'vue';

const currentFolder = ref<string | null>(null)

</script>

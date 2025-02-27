<script setup lang="ts">
import ActivePage from "./components/ActivePage.vue";
import Recipes from "./components/Recipes.vue";
import PageSelector from "./components/PageSelector.vue";
</script>

<template>
  <header>Pata</header>
  <div class="container">
    <aside>
      <Recipes />
    </aside>
    <main>
      <PageSelector />
      <ActivePage />
    </main>
  </div>
  <footer>footer</footer>
</template>

<style scoped>
header {
  background-color: red;
}

main {
  width: 100%;
}

.container {
  display: flex;
  gap: 2em;
  width: 100%;
}

#splash {
  display: flex;
  align-content: center;
}
</style>

<style>
</style>
<script setup lang="ts">
import { ref } from "vue";
import { invoke } from "@tauri-apps/api/core";
import ActivePage from "./components/ActivePage.vue";
import Recipes from "./components/Recipes.vue";
import PageSelector from "./components/PageSelector.vue";

const greetMsg = ref("");
const name = ref("");

async function greet() {
  // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
  greetMsg.value = await invoke("greet", { name: name.value });
}
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
/* https://www.joshwcomeau.com/css/custom-css-reset/ */
/* 1. Use a more-intuitive box-sizing model */
*,
*::before,
*::after {
  box-sizing: border-box;
}

/* 2. Remove default margin */
* {
  margin: 0;
}

body {
  /* 3. Add accessible line-height */
  line-height: 1.5;
  /* 4. Improve text rendering */
  -webkit-font-smoothing: antialiased;
}

/* 5. Improve media defaults */
img,
picture,
video,
canvas,
svg {
  display: block;
  max-width: 100%;
}

/* 6. Inherit fonts for form controls */
input,
button,
textarea,
select {
  font: inherit;
}

/* 7. Avoid text overflows */
p,
h1,
h2,
h3,
h4,
h5,
h6 {
  overflow-wrap: break-word;
}

/* 8. Improve line wrapping */
p {
  text-wrap: pretty;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  text-wrap: balance;
}

/*
  9. Create a root stacking context
*/
#app,
#__next {
  isolation: isolate;
}
</style>
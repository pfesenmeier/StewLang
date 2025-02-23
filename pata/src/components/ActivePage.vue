<template>
  <Splash v-if="active === 'splash'" />
</template>
<script setup lang="ts">
  import { ref } from 'vue'
  import Splash from './Splash.vue';
  type Page = "splash"
  const active = ref<Page>("splash")
</script>

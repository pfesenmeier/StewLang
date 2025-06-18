<template>
  <Splash v-if="active === 'splash'" />
  <Composer v-if="active === 'composer'" />
</template>
<script setup lang="ts">
  import { computed } from 'vue'
import { useFileSystem } from '../composables/useFileSystem';
  type Page = "composer" | "splash"
  const active = computed<Page>(() => {
    if (folderIsOpen.value) {
      return "composer"
    } else {
      return "splash"
    }
  })
  const { folderIsOpen } = useFileSystem()
</script>

<template>
  {{ recipes.length }}
  recipes
</template>
<script setup lang="ts">
import { useRecipeBookFake } from '@/hooks/useRecipeBook'

const { recipes } = useRecipeBookFake()
</script>

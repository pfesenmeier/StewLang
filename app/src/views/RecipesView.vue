<template>
  <h1 class="text-xl">Recipes</h1>
  <div v-for="recipe in recipes">
    <RouterLink
      :to="{
        name: 'recipe',
        params: {
          name: recipe.meta['$name'],
        },
      }"
    >
      <h2>{{ recipe.meta['$name'] }}</h2>
    </RouterLink>
  </div>

  <div class="border-red-100 border-2 mt-32">
    {{ recipes }}
  </div>
</template>
<script setup lang="ts">
import { useRecipeBookFake } from '@/hooks/useRecipeBook'

const { recipes } = useRecipeBookFake()
</script>

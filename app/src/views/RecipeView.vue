<template>
  <div v-if="recipe">
    <h1 class="text-xl">{{ recipe.meta['$name'] }}</h1>
    <div class="divide-y-2 divide-indigo-400">
      <template v-for="ingredient in recipe.ingredients" :key="ingredient.id">
        <Ingredient :ingredient="ingredient" :level="0"></Ingredient>
      </template>
    </div>
    <div class="bg-rose-400 py-1 my-2"></div>
    <div class="border-red-100 border-2 mt-64">
      {{ recipe }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRecipeBookFake } from '@/hooks/useRecipeBook'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import Ingredient from '@/components/Ingredient.vue'
import type { Ingredient as IngredientType } from 'node_modules/stew-lang/esm/parser/ingredient'
import type { Step } from 'node_modules/stew-lang/esm/parser/step'

const route = useRoute()
const { recipes } = useRecipeBookFake()
const recipe = computed(() =>
  recipes.value.find(r => r.meta['$name'] === route.params.name),
)
</script>

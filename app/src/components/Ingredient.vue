<template>
  <div :id="props.ingredient.id" :class="'bg-pink-200 ' + 'ml-' + props.level">
    {{ props.ingredient.name.join(' ') }}
  </div>
  <template v-for="detail in props.ingredient.detail">
    <Ingredient
      v-if="detail.__brand === 'Ingredient'"
      :level="props.level + 2"
      :ingredient="detail"
    ></Ingredient>
    <Step v-else :step="detail"></Step>
  </template>
</template>
<script setup lang="ts">
import Ingredient from '@/components/Ingredient.vue'
import type { Ingredient as IngredientType } from 'node_modules/stew-lang/esm/parser/ingredient'
import Step from './Step.vue'

const props = defineProps<{
  ingredient: IngredientType
  level: number
}>()
</script>

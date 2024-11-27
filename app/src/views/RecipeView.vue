<template>
  <div v-if="recipe">
    <h1 class="text-xl">{{ recipe.meta['$name'] }}</h1>
    <div class="divide-y-2 divide-indigo-400">
      <template v-for="ingredient in recipe.ingredients" :key="ingredient.id">
        <div class="p-2" :id="'#' + ingredient.id">
          {{ ingredient.name.join(' ') }}
        </div>
        <template v-for="detail in ingredient.detail">
          <template v-if="detail.__brand === 'Ingredient'">
            <div :id="detail.id" class="bg-pink-200">{{ (detail as Ingredient).name.join(' ') }}</div>
          </template>
          <template v-else>
            <div class="flex flex-row gap-2">
              <template v-for="word in detail.text">
                <div v-if="typeof word === 'string'">
                  <div>{{ word }}</div>
                </div>
                <div v-else>
                  <a :href="'#' + word.ingredientId">{{ word.name }}</a>
                </div>
              </template>
            </div>
          </template>
        </template>
      </template>
    </div>
    <div class="bg-rose-400 py-1 my-2"></div>
    <div class="border-red-100 border-2 mt-32">
      {{ recipe }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRecipeBookFake } from '@/hooks/useRecipeBook'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import type { Ingredient } from 'node_modules/stew-lang/esm/parser/ingredient'
import type { Step } from 'node_modules/stew-lang/esm/parser/step'

const route = useRoute()
const { recipes } = useRecipeBookFake()
const recipe = computed(() =>
  recipes.value.find(r => r.meta['$name'] === route.params.name),
)
</script>

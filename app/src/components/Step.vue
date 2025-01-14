<template>
  <div class="flex flex-row gap-2">
    <template v-for="word in props.step.text">
      <div v-if="typeof word === 'string'">
        <div>{{ word }}</div>
      </div>
      <div v-else>
        <a class="bg-green-200" :href="'#' + word.ingredientId">{{
          word.name
        }}</a>
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
import type { Step } from 'node_modules/stew-lang/esm/parser/step'

const props = defineProps<{
  step: Step
}>()
</script>

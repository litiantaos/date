<template>
  <div class="flex items-center rounded-sm border border-gray-200 bg-white">
    <button
      v-for="(item, index) in ['一言', '诗词']"
      :class="[
        'btn',
        { 'bg-blue-50 text-blue-400': index === state.sentenceType },
      ]"
      @click="switchType(index)"
    >
      {{ item }}
    </button>
  </div>
</template>

<script setup>
import { state, setSentenceType } from '../stores'

const switchType = (index) => {
  setSentenceType(index)
}
</script>

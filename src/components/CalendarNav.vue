<template>
  <header
    class="calendar-nav relative z-20 flex items-center justify-between px-4 py-8"
  >
    <div>
      <h2 class="text-2xl font-bold">
        {{ formattedDate }}
      </h2>
    </div>

    <div class="flex items-center gap-4">
      <SentenceType />

      <div class="flex items-center rounded-sm border border-gray-200">
        <button @click="$emit('prev-month')" class="px-1">
          <RiArrowLeftSLine size="18px" />
        </button>

        <button @click="handleTodayClick" class="border-x border-gray-200">
          今天
        </button>

        <button @click="$emit('next-month')" class="px-1">
          <RiArrowRightSLine size="18px" />
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { RiArrowLeftSLine, RiArrowRightSLine } from '@remixicon/vue'
import SentenceType from './SentenceType.vue'

const props = defineProps({
  currentYear: {
    type: Number,
    required: true,
  },
  currentMonth: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['prev-month', 'next-month', 'today-click'])

// 格式化日期显示
const formattedDate = computed(() => {
  const month = props.currentMonth + 1
  return `${props.currentYear}年${month < 10 ? `0${month}` : month}月`
})

// 处理今天按钮点击
const handleTodayClick = () => {
  const today = new Date()
  const isCurrentMonth =
    today.getFullYear() === props.currentYear &&
    today.getMonth() === props.currentMonth

  emit('today-click', { isCurrentMonth })
}
</script>

<template>
  <div
    :class="[
      'absolute flex cursor-pointer flex-col items-center border-gray-200 transition-all duration-500 will-change-[transform,width,height]',
      isExpanded ? 'rounded-sm border p-4' : 'border-t p-2',
      cellClasses,
    ]"
    :style="cellStyle"
  >
    <!-- 日期数字 -->
    <div
      :class="[
        'font-bold transition-all duration-500',
        isActive ? 'mt-16 text-8xl' : 'mt-3 text-sm',
      ]"
    >
      {{ day.date.getDate() }}
    </div>

    <div
      class="transition-[margin] duration-500"
      :class="isExpanded ? 'mt-10' : 'mt-3'"
    >
      <!-- 农历月日 -->
      <TransitionGroup name="list" tag="div" class="flex justify-center">
        <div v-if="isActiveDelay" key="mon">{{ day.lunarMonCN }}</div>
        <div key="day">{{ day.lunarDayCN }}</div>
      </TransitionGroup>

      <div class="mt-2 space-x-2 text-center whitespace-nowrap">
        <!-- 节日 -->
        <span v-if="day.holidayName" class="text-red-400">{{
          day.holidayName
        }}</span>

        <!-- 调休调班 -->
        <span
          v-if="day.holidayName"
          :class="[
            'rounded-sm px-1 py-0.5',
            day.work
              ? 'bg-orange-100 text-orange-400'
              : 'bg-blue-100 text-blue-400',
          ]"
        >
          {{ day.work ? '班' : day.isInLieu ? '调' : '休' }}
        </span>

        <!-- 节气 -->
        <span
          v-if="day.solarTerm?.index === 1"
          class="w-fit rounded-sm bg-emerald-100 px-1 py-0.5 text-center text-emerald-400"
        >
          {{ day.solarTerm?.name }}
        </span>
      </div>
    </div>

    <Transition name="fade-zoom">
      <div
        v-if="isActiveDelay"
        class="flex h-full flex-col items-center justify-around"
      >
        <!-- 句子 -->
        <div v-if="sentence" class="text-center text-sm leading-6">
          <div class="font-bold">
            {{ sentence?.hitokoto || sentence?.content }}
          </div>
          <div v-if="hasSource" class="mt-4 space-x-1">
            <span v-if="sourceTitle"> 《{{ sourceTitle }}》 </span>
            <span v-if="sourceAuthor">
              {{ sourceAuthor }}
            </span>
          </div>
        </div>

        <div class="text-center">
          <p>
            {{ day.yearCyl }}{{ day.zodiac }}年 {{ day.monCyl }}月
            {{ day.dayCyl }}日
          </p>
          <p class="mt-2">
            {{
              day.work
                ? '又是需要工作的一天！'
                : day.isInLieu
                  ? '虽然调休，但要补班还回来的！'
                  : '休息啦~'
            }}
          </p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { fetchSentence } from '../utils/sentences'

const props = defineProps({
  day: Object,
  index: Number,
  cellStyle: Object,
  isExpanded: Boolean,
  isActive: Boolean,
})

// 计算属性
const cellClasses = computed(() => ({
  'border-r': (props.index + 1) % 7 !== 0,
  'bg-blue-50': props.day.isToday,
  'bg-gray-50 text-gray-400': props.day.disable,
  'bg-orange-50': props.isActive,
  'text-red-400': !props.day.work,
}))

const sourceTitle = computed(
  () => sentence.value?.from || sentence.value?.origin?.title,
)

const sourceAuthor = computed(
  () => sentence.value?.from_who || sentence.value?.origin?.author,
)

const hasSource = computed(
  () =>
    sentence.value?.from || sentence.value?.from_who || sentence.value?.origin,
)

// 监听 isActive 变化
const isActiveDelay = ref(false)

watch(
  () => props.isActive,
  (newValue) => {
    if (newValue) {
      setTimeout(() => {
        isActiveDelay.value = true
      }, 300)
    } else {
      isActiveDelay.value = false
    }
  },
)

// 获取句子
const sentence = ref('')

watch(
  () => props.isActive,
  async (newValue) => {
    if (newValue && !sentence.value) {
      sentence.value = await fetchSentence()
    }
  },
)
</script>

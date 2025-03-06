<template>
  <div class="relative h-screen w-screen" ref="viewport">
    <CalendarNav
      :current-year="currentYear"
      :current-month="currentMonth"
      @prev-month="prevMonth"
      @next-month="nextMonth"
      @today-click="handleTodayClick"
    />

    <div
      class="relative text-xs transition-[transform,width,height] duration-500 will-change-[transform,width,height]"
      :style="gridContainerStyle"
    >
      <div
        class="calendar-week flex w-full justify-around py-4 text-center font-bold text-gray-400"
      >
        <div v-for="week in weekDays" :key="week">{{ week }}</div>
      </div>

      <CalendarCell
        v-for="(day, index) in daysInfo"
        :key="`${day.date.getTime()}-${index}`"
        :day="day"
        :index="index"
        :cell-style="getCellStyle(index)"
        :is-expanded="isExpanded"
        :is-active="index === activeCell"
        @click="handleCellClick(index)"
      />
    </div>

    <Transition>
      <div
        v-if="isExpanded"
        class="pointer-events-none fixed top-0 right-0 left-0 z-10 h-1/4 bg-linear-to-b from-white to-transparent"
      />
    </Transition>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import chineseDays from 'https://esm.run/chinese-days'
import CalendarNav from './CalendarNav.vue'
import CalendarCell from './CalendarCell.vue'
import { useGridLayout } from '../composables/useGridLayout'

const { getDayDetail, getLunarDate, getSolarTermsInRange, isInLieu } =
  chineseDays

const currentDate = ref(new Date())
const currentYear = ref(currentDate.value.getFullYear())
const currentMonth = ref(currentDate.value.getMonth())
const viewport = ref(null)

const weekDays = ['日', '一', '二', '三', '四', '五', '六']

// 日期计算
const daysInMonth = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const days = []

  const firstDayIndex = (firstDay.getDay() + 7) % 7
  const lastDayIndex = (lastDay.getDay() + 7) % 7

  // 上月日期
  for (let i = firstDayIndex; i > 0; i--) {
    days.push(new Date(year, month, -i + 1))
  }

  // 当月日期
  for (let day = 1; day <= lastDay.getDate(); day++) {
    days.push(new Date(year, month, day))
  }

  // 下月日期
  for (let i = 1; i < 7 - lastDayIndex; i++) {
    days.push(new Date(year, month + 1, i))
  }

  return days
})

// 日期信息处理
const getDayInfo = (date) => {
  const dayDetail = getDayDetail(date)
  const holidayName = dayDetail.name.split(',')[1]
  return {
    ...dayDetail,
    ...getLunarDate(date),
    date,
    holidayName,
    isToday: isToday(date),
    isInLieu: isInLieu(date),
    solarTerm: getSolarTermsInRange(date)[0],
    disable: currentMonth.value !== date.getMonth(),
  }
}

const daysInfo = computed(() => daysInMonth.value.map(getDayInfo))

// 布局相关
const {
  isExpanded,
  activeCell,
  gridContainerStyle,
  getCellStyle,
  handleCellClick,
  updateViewportSize,
  cleanup,
} = useGridLayout(viewport, daysInfo)

// 生命周期
onMounted(() => {
  updateViewportSize()
  window.addEventListener('resize', updateViewportSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateViewportSize)
  cleanup()
})

// 月份导航
const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

// 工具函数
const isToday = (date) => {
  const today = new Date()
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

// 今天按钮处理
const handleTodayClick = ({ isCurrentMonth }) => {
  if (!isCurrentMonth) {
    const today = new Date()
    currentYear.value = today.getFullYear()
    currentMonth.value = today.getMonth()
  } else {
    const todayIndex = daysInfo.value.findIndex((day) => day.isToday)
    if (todayIndex !== -1) {
      handleCellClick(todayIndex)
    }
  }
}

// console.log(daysInfo.value)
</script>

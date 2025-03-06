import { reactive } from 'vue'

const state = reactive({
  sentenceType: 0, // 0 一言 1 诗词
})

const setSentenceType = (type) => {
  state.sentenceType = type
}

export { state, setSentenceType }

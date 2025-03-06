import { reactive } from 'vue'

const state = reactive({
  sentenceType: Number(localStorage.getItem('sentence_type')) || 0,
})

const setSentenceType = (type) => {
  state.sentenceType = Number(type)
  localStorage.setItem('sentence_type', state.sentenceType)
}

export { state, setSentenceType }

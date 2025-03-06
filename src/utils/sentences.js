import { state } from '../stores'
import { loadShici } from './jinrishici'

const fetchFromHitokoto = async () => {
  const response = await fetch('https://v1.hitokoto.cn')
  return response.json()
}

const fetchFromJinrishici = async () => {
  const result = await loadShici()
  return result.data
}

export const fetchSentence = async () => {
  return state.sentenceType === 0 ? fetchFromHitokoto() : fetchFromJinrishici()
}

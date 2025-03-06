import { state } from '../stores'

const SHICI_TOKEN = 'shici_token'

const fetchFromHitokoto = async () => {
  const response = await fetch('/hitokoto')
  return response.json()
}

const fetchFromJinrishici = async (token) => {
  const response = await fetch('/jinrishici/sentence', {
    headers: token ? { 'X-User-Token': token } : {},
  })
  const data = await response.json()
  return data.data
}

const getShiciToken = async () => {
  let token = localStorage.getItem(SHICI_TOKEN)

  if (!token) {
    try {
      const response = await fetch('/jinrishici/token')
      const { status, data } = await response.json()
      if (status === 'success') {
        token = data
        localStorage.setItem(SHICI_TOKEN, token)
      }
    } catch (error) {
      console.error('获取诗词 token 失败:', error)
      return null
    }
  }

  return token
}

export const fetchSentence = async (date) => {
  const sources =
    state.sentenceType === 0
      ? [
          fetchFromHitokoto,
          async () => fetchFromJinrishici(await getShiciToken()),
        ]
      : [
          async () => fetchFromJinrishici(await getShiciToken()),
          fetchFromHitokoto,
        ]

  for (const fetchFn of sources) {
    try {
      return await fetchFn()
    } catch (error) {
      console.error(`数据源获取失败:`, error)
      // 继续尝试下一个数据源
    }
  }

  console.error(`获取句子失败 ${date ? '(' + date + ')' : ''}`)
  return { content: '没有获取到内容，但还是要开心！' }
}

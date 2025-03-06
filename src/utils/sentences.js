import { state } from '../stores'

const SHICI_TOKEN = 'shici_token'

// 根据环境确定基础URL
const getBaseUrl = (path) => {
  // 判断是否为生产环境
  const isProd = import.meta.env.PROD

  if (isProd) {
    if (path.startsWith('/hitokoto')) {
      return `https://v1.hitokoto.cn`
    }
  }

  // 其他情况都使用相对路径
  return path
}

const fetchFromHitokoto = async () => {
  const url = getBaseUrl('/hitokoto')
  const response = await fetch(url, {
    method: 'GET',
    mode: 'cors',
  })
  return response.json()
}

const fetchFromJinrishici = async (token) => {
  const url = getBaseUrl('/jinrishici/sentence')
  const response = await fetch(url, {
    method: 'GET',
    mode: 'cors',
    headers: token ? { 'X-User-Token': token } : {},
  })
  const data = await response.json()
  return data.data
}

const getShiciToken = async () => {
  let token = localStorage.getItem(SHICI_TOKEN)

  if (!token) {
    try {
      const url = getBaseUrl('/jinrishici/token')
      const response = await fetch(url)
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
    }
  }

  console.error(`获取句子失败 ${date ? '(' + date + ')' : ''}`)
  return { content: '没有获取到内容，但还是要开心！' }
}

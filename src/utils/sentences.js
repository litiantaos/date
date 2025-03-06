import { state } from '../stores'

const SHICI_TOKEN = 'shici_token'

// 根据环境确定基础URL
const getBaseUrl = (path) => {
  // 判断是否为生产环境
  const isProd = import.meta.env.PROD

  if (isProd) {
    // 生产环境直接使用完整URL
    if (path.startsWith('/hitokoto')) {
      return `https://v1.hitokoto.cn`
    } else if (path.startsWith('/jinrishici')) {
      return `https://v2.jinrishici.com${path.replace('/jinrishici', '')}`
    }
  }

  // 开发环境使用相对路径，依赖Vite代理
  return path
}

const fetchFromHitokoto = async () => {
  const url = getBaseUrl('/hitokoto', {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const response = await fetch(url)
  return response.json()
}

const fetchFromJinrishici = async (token) => {
  const url = getBaseUrl('/jinrishici/sentence')
  const response = await fetch(url, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'X-User-Token': token } : {}),
    },
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
      // 继续尝试下一个数据源
    }
  }

  console.error(`获取句子失败 ${date ? '(' + date + ')' : ''}`)
  return { content: '没有获取到内容，但还是要开心！' }
}

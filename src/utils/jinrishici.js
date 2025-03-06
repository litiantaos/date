const keyName = 'shici_token'

const sendRequest = async (apiUrl) => {
  try {
    const response = await fetch(apiUrl, { credentials: 'include' })
    const data = await response.json()
    if (data.status === 'success') {
      if (window.localStorage) {
        window.localStorage.setItem(keyName, data.token)
      }
      return data
    } else {
      throw new Error(data.errMessage)
    }
  } catch (error) {
    console.error('今日诗词加载失败：' + error.message)
    throw error
  }
}

const loadShici = async () => {
  const token = window.localStorage?.getItem(keyName)
  const baseUrl = 'https://v2.jinrishici.com/one.json?client=npm-sdk/1.0'
  const apiUrl = token
    ? `${baseUrl}&X-User-Token=${encodeURIComponent(token)}`
    : baseUrl

  return sendRequest(apiUrl)
}

export { loadShici }

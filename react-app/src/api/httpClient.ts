// 【Axios 实例】统一请求客户端：baseURL、超时、请求/响应拦截器
import axios from 'axios'
import { isLoggedIn, logout } from '../utils/auth'

// 创建请求实例：所有请求以 /api 为前缀，10 秒超时
const httpClient = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

// 请求拦截器：登录后统一附加凭证到请求头（未登录不附加）
httpClient.interceptors.request.use((config) => {
  if (isLoggedIn()) {
    config.headers.Authorization = 'Bearer mock-token'
  }
  return config
})

// 响应拦截器：401 清除登录态并跳转登录页；业务错误抛出可展示的 Error
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 【TypeScript 可选链】error.response 不存在时 status 为 undefined，不触发 401 分支
    const status: number | undefined = error.response?.status
    if (status === 401) {
      logout()
      // 已在登录页时不重复跳转
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login'
      }
    }
    // 优先使用响应体中的 message，其次使用 axios 原始错误信息
    const message: string = error.response?.data?.message ?? error.message ?? '请求失败'
    return Promise.reject(new Error(message))
  }
)

export default httpClient

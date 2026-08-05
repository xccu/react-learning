// 【JavaScript localStorage 工具】使用 localStorage 持久化登录态
const LOGIN_STORAGE_KEY = 'react-app:isLoggedIn'

// 判断当前是否已登录
export function isLoggedIn(): boolean {
  return localStorage.getItem(LOGIN_STORAGE_KEY) === 'true'
}

// 保存登录状态
export function login(): void {
  localStorage.setItem(LOGIN_STORAGE_KEY, 'true')
}

// 清除登录状态
export function logout(): void {
  localStorage.removeItem(LOGIN_STORAGE_KEY)
}

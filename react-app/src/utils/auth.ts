// 【JavaScript localStorage 工具】使用 localStorage 持久化登录态
const LOGIN_STORAGE_KEY = 'react-app:isLoggedIn'
const USERNAME_STORAGE_KEY = 'react-app:username'

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
  localStorage.removeItem(USERNAME_STORAGE_KEY)
}

// 保存当前用户名
export function saveUsername(username: string): void {
  localStorage.setItem(USERNAME_STORAGE_KEY, username)
}

// 读取当前用户名
export function getUsername(): string | null {
  return localStorage.getItem(USERNAME_STORAGE_KEY)
}

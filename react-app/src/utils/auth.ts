// 【JavaScript localStorage 工具】使用 localStorage 持久化登录态和权限信息
const LOGIN_STORAGE_KEY = 'react-app:isLoggedIn'
const USERNAME_STORAGE_KEY = 'react-app:username'
const PERMISSIONS_STORAGE_KEY = 'react-app:permissions'

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
  localStorage.removeItem(PERMISSIONS_STORAGE_KEY)
}

// 保存当前用户名
export function saveUsername(username: string): void {
  localStorage.setItem(USERNAME_STORAGE_KEY, username)
}

// 读取当前用户名
export function getUsername(): string | null {
  return localStorage.getItem(USERNAME_STORAGE_KEY)
}

// 保存权限列表
export function savePermissions(permissions: string[]): void {
  localStorage.setItem(PERMISSIONS_STORAGE_KEY, JSON.stringify(permissions))
}

// 读取权限列表
export function getPermissions(): string[] {
  const data = localStorage.getItem(PERMISSIONS_STORAGE_KEY)
  if (!data) return []
  try {
    return JSON.parse(data)
  } catch {
    return []
  }
}

// 检查是否有指定权限
export function hasPermission(permission: string): boolean {
  const permissions = getPermissions()
  return permissions.includes(permission)
}
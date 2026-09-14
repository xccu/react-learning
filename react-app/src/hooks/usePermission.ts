import { useSelector } from 'react-redux'
import type { RootState } from '../store'
import { getPermissions } from '../utils/auth'

function usePermission(permission: string): boolean {
  const currentUser = useSelector((state: RootState) => state.user.currentUser)
  const roles = useSelector((state: RootState) => state.user.roles)

  if (!currentUser) {
    const storedPermissions = getPermissions()
    return storedPermissions.includes(permission)
  }

  const userPermissions = new Set<string>()
  currentUser.roles.forEach((roleName) => {
    const role = roles.find((r) => r.name === roleName)
    if (role) {
      role.permissions.forEach((p) => userPermissions.add(p))
    }
  })

  if (userPermissions.has(permission)) {
    return true
  }

  if (userPermissions.size === 0) {
    const storedPermissions = getPermissions()
    return storedPermissions.includes(permission)
  }

  return false
}

export default usePermission
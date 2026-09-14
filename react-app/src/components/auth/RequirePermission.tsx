import { useSelector } from 'react-redux'
import type { ReactNode } from 'react'
import type { RootState } from '../../store'
import { getPermissions } from '../../utils/auth'

function RequirePermission({
  permissions,
  fallback = null,
  children,
}: {
  permissions: string[]
  fallback?: ReactNode
  children: ReactNode
}) {
  const currentUser = useSelector((state: RootState) => state.user.currentUser)
  const roles = useSelector((state: RootState) => state.user.roles)

  if (!currentUser) {
    return <>{fallback}</>
  }

  const userPermissions = new Set<string>()
  currentUser.roles.forEach((roleName) => {
    const role = roles.find((r) => r.name === roleName)
    if (role) {
      role.permissions.forEach((p) => userPermissions.add(p))
    }
  })

  if (userPermissions.size > 0) {
    const hasAllPermissions = permissions.every((p) => userPermissions.has(p))
    return hasAllPermissions ? <>{children}</> : <>{fallback}</>
  }

  const storedPermissions = getPermissions()
  const hasAllPermissions = permissions.every((p) => storedPermissions.includes(p))
  return hasAllPermissions ? <>{children}</> : <>{fallback}</>
}

export default RequirePermission
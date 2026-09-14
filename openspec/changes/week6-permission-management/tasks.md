## 1. Type Definitions and Constants

- [x] 1.1 Add Permission, Role, PermissionMap types to types/timeEntry.ts
- [x] 1.2 Update UserRole type from '管理员' | '普通用户' to 'Administrator' | 'ProjectManager' | 'User'
- [x] 1.3 Define PERMISSIONS constant array with all 9 permission identifiers
- [x] 1.4 Define PERMISSION_LABELS mapping (permission key → Chinese label for Transfer display)
- [x] 1.5 Define ROLE_PERMISSIONS mapping (default permissions for each of the 3 roles)

## 2. Mock Data and API Layer

- [x] 2.1 Add roles and permissions data to api/mockApi.ts
- [x] 2.2 Update default users: Administrator, ProjectManager, User with new roles and password "Pass@word0"
- [x] 2.3 Add role CRUD functions to mockApi (getRoles, getRoleById, createRole, updateRole, deleteRole)
- [x] 2.4 Add permission check function to mockApi (hasPermission(userId, permission))
- [x] 2.5 Add role API routes to mockAdapter.ts (GET/POST/PUT/DELETE /api/roles)
- [x] 2.6 Add role API function signatures to api/timeEntryApi.ts

## 3. Redux Store Updates

- [x] 3.1 Add roles, currentRole state fields to store/userSlice.ts
- [x] 3.2 Add getPermissionsForUser helper that collects permissions from all user roles
- [x] 3.3 Update loginUser thunk to include user permissions in success action payload
- [x] 3.4 Add fetchRoles thunk to load roles from API
- [x] 3.5 Add createRole, updateRole, deleteRole thunks

## 4. Authentication Utilities

- [x] 4.1 Update utils/auth.ts login() to accept and store permissions in localStorage
- [x] 4.2 Add getPermissions() helper to read permissions from localStorage
- [x] 4.3 Update logout() to clear permissions from localStorage

## 5. Login Page Updates

- [x] 5.1 Update LoginPage.tsx QUICK_LOGIN_MAP: admin→Administrator, user1→ProjectManager, user2→User
- [x] 5.2 Update quick login links to show Administrator/ProjectManager/User
- [x] 5.3 Update login validation to accept password "Pass@word0" for all default users
- [x] 5.4 Update login success handler to dispatch fetchRoles after login

## 6. Permission Model Pages

- [x] 6.1 Create pages/PermissionListPage.tsx with role table (name + delete button)
- [x] 6.2 Implement Administrator role delete button as disabled
- [x] 6.3 Implement delete confirmation dialog for non-Administrator roles
- [x] 6.4 Add "Add Role" button that navigates to PermissionAssignPage with new role mode
- [x] 6.5 Create pages/PermissionAssignPage.tsx with role name input and Transfer component
- [x] 6.6 Implement Transfer component: left=unassigned permissions, right=assigned permissions
- [x] 6.7 Support both create and edit modes in PermissionAssignPage
- [x] 6.8 Wire up role CRUD actions to API calls

## 7. Permission Control Components

- [x] 7.1 Create components/auth/RequirePermission.tsx HOC component
- [x] 7.2 Create hooks/usePermission.ts Hook that checks currentUser permissions
- [x] 7.3 Create pages/UnauthorizedPage.tsx for 403 display
- [x] 7.4 Export usePermission from a centralized permissions module

## 8. Navigation and Routing

- [x] 8.1 Define MENU_ITEMS permission mapping in components/timesheet/AppLayout.tsx
- [x] 8.2 Update AppLayout.tsx to filter menu items by user permissions
- [x] 8.3 Add "权限管理" menu item with Role.Read permission requirement
- [x] 8.4 Add /permissions route to App.tsx (requires Role.Read)
- [x] 8.5 Add /permissions/assign route to App.tsx (requires Role.Write)
- [x] 8.6 Extend RequireAuth.tsx to accept optional permissions prop
- [x] 8.7 Add permission checks to all protected routes in App.tsx

## 9. Button and Component Permission Control

- [x] 9.1 Add permission checks to timesheet create/edit/delete buttons (TimeSheet.Write)
- [x] 9.2 Add permission checks to timesheet approval/reject buttons (TimeSheet.approval)
- [x] 9.3 Add permission checks to user create/edit/delete buttons (User.Write)
- [x] 9.4 Add permission checks to user list view (User.Read)
- [x] 9.5 Use RequirePermission or usePermission in TimeEntryListPage, TimeEntryCreatePage, TimeEntryEditPage
- [x] 9.6 Use RequirePermission or usePermission in UserListPage, UserCreatePage, UserEditPage

## 10. API Permission Interception

- [x] 10.1 Add permission check in httpClient.ts response interceptor for 403 handling
- [x] 10.2 Add permission validation in mockAdapter.ts for role-write protected endpoints
- [x] 10.3 Ensure delete role endpoint checks for Administrator role protection

## 11. Testing and Verification

- [ ] 11.1 Test login as Administrator - verify all menu items and permissions visible
- [ ] 11.2 Test login as ProjectManager - verify timesheet and user CRUD visible, no role management
- [ ] 11.3 Test login as User - verify only timesheet read/write, no user/role management
- [ ] 11.4 Test direct URL access without permission → 403 page
- [ ] 11.5 Test unauthenticated access → redirect to login
- [ ] 11.6 Test post-login redirect to original URL
- [ ] 11.7 Test creating a new role with permission assignment via Transfer
- [ ] 11.8 Test deleting a non-Administrator role
- [ ] 11.9 Verify Administrator role cannot be deleted
## ADDED Requirements

### Requirement: Page-level permission control
The system SHALL restrict page access based on user permissions. Users without the required permission SHALL be redirected to a 403 page.

#### Scenario: TimeSheet.Read permission for timesheet pages
- **WHEN** a user accesses the timesheet list or detail page
- **THEN** the user MUST have the TimeSheet.Read permission, otherwise they are redirected to the 403 page

#### Scenario: TimeSheet.approval permission for approval actions
- **WHEN** a user accesses the timesheet approval/reject functionality
- **THEN** the user MUST have the TimeSheet.approval permission, otherwise the UI is hidden and API access returns 403

#### Scenario: TimeSheet.Write permission for timesheet CRUD
- **WHEN** a user accesses the timesheet create/edit/delete functionality
- **THEN** the user MUST have the TimeSheet.Write permission, otherwise the UI is hidden and API access returns 403

#### Scenario: User.Read permission for user management pages
- **WHEN** a user accesses the user list or detail page
- **THEN** the user MUST have the User.Read permission, otherwise they are redirected to the 403 page

#### Scenario: User.Write permission for user CRUD
- **WHEN** a user accesses the user create/edit/delete functionality
- **THEN** the user MUST have the User.Write permission, otherwise the UI is hidden and API access returns 403

#### Scenario: Role.Read permission for permission management page
- **WHEN** a user accesses the permission management page
- **THEN** the user MUST have the Role.Read permission, otherwise they are redirected to the 403 page

#### Scenario: Role.Write permission for role CRUD
- **WHEN** a user accesses the role create/assign/delete functionality
- **THEN** the user MUST have the Role.Write permission, otherwise the UI is hidden and API access returns 403

### Requirement: Navigation bar permission control
The system SHALL dynamically render navigation bar menu items based on user permissions.

#### Scenario: Permission-based menu rendering
- **WHEN** the navigation bar is rendered
- **THEN** menu items are only shown if the user has the corresponding permission (e.g., TimeSheet.Read → 工时列表, Role.Read → 权限管理)

#### Scenario: Unauthorized menu items hidden
- **WHEN** a user lacks a specific permission
- **THEN** the corresponding navigation menu item is not displayed

### Requirement: Button and component permission control
The system SHALL hide buttons and components based on user permissions.

#### Scenario: Button visibility based on permission
- **WHEN** a page with permission-controlled buttons is rendered
- **THEN** buttons are only visible if the user has the required permission

#### Scenario: Component visibility based on permission
- **WHEN** a component with permission control is rendered
- **THEN** the component is only displayed if the user has the required permission

### Requirement: API request permission control
The system SHALL enforce permissions on API requests. Requests without proper authorization SHALL fail.

#### Scenario: Unauthorized API request
- **WHEN** a user makes an API request without the required permission
- **THEN** the API returns a 403 status code

#### Scenario: Authorized API request
- **WHEN** a user makes an API request with the required permission
- **THEN** the API processes the request normally

### Requirement: Unauthenticated access redirect
The system SHALL redirect unauthenticated users to the login page.

#### Scenario: Access without login
- **WHEN** a user accesses any protected page URL without being logged in
- **THEN** the user is redirected to the login page with the original URL stored for post-login redirect

#### Scenario: Post-login redirect
- **WHEN** a user logs in after being redirected from a protected page
- **THEN** the user is redirected back to the originally requested URL

#### Scenario: Post-login no permission
- **WHEN** a user logs in but lacks the permission for the originally requested page
- **THEN** the user is redirected to the 403 page
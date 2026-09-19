## ADDED Requirements

### Requirement: Frontend uses real API for TimeEntry CRUD
The React frontend SHALL call the FastAPI backend via `httpClient` (axios instance with `baseURL: '/api'`) for all TimeEntry operations instead of using `mockApi.ts`.

#### Scenario: List time entries from real API
- **WHEN** user navigates to timesheet list page
- **THEN** system calls `GET /api/time-entries` and displays the returned data

#### Scenario: Create time entry via real API
- **WHEN** user submits a new time entry form
- **THEN** system calls `POST /api/time-entries` with the form data and displays the created entry

#### Scenario: Update time entry via real API
- **WHEN** user edits an existing time entry
- **THEN** system calls `PUT /api/time-entries/{id}` with the updated fields

#### Scenario: Delete time entry via real API
- **WHEN** user deletes a time entry
- **THEN** system calls `DELETE /api/time-entries/{id}` and removes the entry from the list

#### Scenario: Batch create time entries via real API
- **WHEN** user imports time entries from Excel file
- **THEN** system calls `POST /api/time-entries/batch` with all entries and displays created entries

#### Scenario: Submit time entry for approval via real API
- **WHEN** user submits a time entry for approval
- **THEN** system calls `PUT /api/time-entries/{id}/submit` and updates the status to "待审批"

#### Scenario: Approve time entry via real API
- **WHEN** user with approval permission approves a time entry
- **THEN** system calls `PUT /api/time-entries/{id}/approve` and updates the status to "已通过"

#### Scenario: Reject time entry via real API
- **WHEN** user with approval permission rejects a time entry
- **THEN** system calls `PUT /api/time-entries/{id}/reject` with reason and updates status to "已驳回"

### Requirement: Frontend uses real API for User CRUD
The React frontend SHALL call the FastAPI backend for all User operations instead of using `mockApi.ts`.

#### Scenario: List users from real API
- **WHEN** user navigates to user management page
- **THEN** system calls `GET /api/users` and displays the returned data

#### Scenario: Create user via real API
- **WHEN** admin creates a new user
- **THEN** system calls `POST /api/users` with username, password, and roles

#### Scenario: Update user via real API
- **WHEN** admin edits an existing user
- **THEN** system calls `PUT /api/users/{id}` with updated fields

#### Scenario: Delete user via real API
- **WHEN** admin deletes a user
- **THEN** system calls `DELETE /api/users/{id}` and removes the user from the list

### Requirement: Frontend uses real API for Role operations
The React frontend SHALL call the FastAPI backend for all Role operations instead of using `mockApi.ts`.

#### Scenario: List roles from real API
- **WHEN** user navigates to permission management page
- **THEN** system calls `GET /api/roles` and displays the returned data

#### Scenario: Create role via real API
- **WHEN** admin creates a new role with permissions
- **THEN** system calls `POST /api/roles` with name and permissions array

#### Scenario: Update role via real API
- **WHEN** admin edits a role's permissions
- **THEN** system calls `PUT /api/roles/{id}` with updated name and permissions

#### Scenario: Delete role via real API
- **WHEN** admin deletes a non-Administrator role
- **THEN** system calls `DELETE /api/roles/{id}` and removes the role from the list

#### Scenario: Delete Administrator role returns 403
- **WHEN** admin attempts to delete the Administrator role
- **THEN** system receives HTTP 403 and displays "不能删除 Administrator 角色" error message

### Requirement: Login flow uses real API
The React frontend SHALL use the real login endpoint to authenticate users and fetch permissions.

#### Scenario: Login with valid credentials
- **WHEN** user enters valid username and password and clicks login
- **THEN** system calls `POST /api/users/login` and receives user data with permissions

#### Scenario: Login with invalid credentials
- **WHEN** user enters invalid username or password
- **THEN** system receives HTTP 401 and displays "用户名或密码错误" error message

#### Scenario: Login fetches roles for permission calculation
- **WHEN** login succeeds
- **THEN** system also calls `GET /api/roles` to load role list and computes user permissions from user roles

### Requirement: Mock adapter and mock data removed
The React frontend SHALL remove all mock-related code after switching to real API.

#### Scenario: mockApi.ts removed
- **WHEN** build runs
- **THEN** `src/api/mockApi.ts` file does not exist and no import references it

#### Scenario: mockAdapter.ts removed
- **WHEN** build runs
- **THEN** `src/api/mockAdapter.ts` file does not exist and no import references it

#### Scenario: No axios-mock-adapter dependency
- **WHEN** dependencies are installed
- **THEN** `axios-mock-adapter` is not in `package.json` dependencies

### Requirement: Error handling for API failures
The React frontend SHALL handle API errors gracefully with user-friendly messages.

#### Scenario: Network error displays message
- **WHEN** API request fails due to network error
- **THEN** system displays the error message from the response or a generic "请求失败" message

#### Scenario: 401 redirects to login
- **WHEN** API returns HTTP 401
- **THEN** system clears login state and redirects to `/login`

#### Scenario: 403 redirects to unauthorized page
- **WHEN** API returns HTTP 403
- **THEN** system redirects to `/unauthorized` page

### Requirement: Vite proxy for API requests
The React frontend development server SHALL proxy `/api` requests to the FastAPI backend.

#### Scenario: Vite dev proxy configured
- **WHEN** developer runs `npm run dev`
- **THEN** requests to `/api/*` are proxied to `http://localhost:8000`

#### Scenario: Production build uses relative path
- **WHEN** app is built for production
- **THEN** API requests use relative path `/api` served by the backend server
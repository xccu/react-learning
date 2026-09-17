## ADDED Requirements

### Requirement: TimeEntry list query
The system SHALL return a list of time entries with support for filtering by projectName, description, and approvalStatus.

#### Scenario: List all time entries
- **WHEN** client sends `GET /api/time-entries`
- **THEN** system returns 200 with all time entries

#### Scenario: Filter by projectName
- **WHEN** client sends `GET /api/time-entries?projectName=React`
- **THEN** system returns 200 with entries matching "React" (case-insensitive fuzzy match)

#### Scenario: Filter by description
- **WHEN** client sends `GET /api/time-entries?description=学习`
- **THEN** system returns 200 with entries matching "学习" (case-insensitive fuzzy match)

#### Scenario: Filter by approvalStatus
- **WHEN** client sends `GET /api/time-entries?approvalStatus=待审批`
- **THEN** system returns 200 with entries having approvalStatus "待审批"

#### Scenario: Filter by empty approvalStatus (unlimited)
- **WHEN** client sends `GET /api/time-entries?approvalStatus=`
- **THEN** system returns 200 with all entries regardless of approvalStatus

#### Scenario: Combined filters
- **WHEN** client sends `GET /api/time-entries?projectName=React&approvalStatus=待审批`
- **THEN** system returns 200 with entries matching both conditions

### Requirement: TimeEntry detail
The system SHALL return a single time entry by ID.

#### Scenario: Get existing time entry
- **WHEN** client sends `GET /api/time-entries/1`
- **THEN** system returns 200 with the time entry object

#### Scenario: Get non-existent time entry
- **WHEN** client sends `GET /api/time-entries/999`
- **THEN** system returns 404 with `{"message": "记录不存在"}`

### Requirement: TimeEntry create
The system SHALL create a new time entry and return it with generated id and createdAt.

#### Scenario: Create valid time entry
- **WHEN** client sends `POST /api/time-entries` with `{"projectName": "项目B", "description": "开发用户管理", "hours": 4, "approvalStatus": "待审批"}`
- **THEN** system returns 201 with the created time entry including generated id and createdAt

#### Scenario: Create time entry with missing required field
- **WHEN** client sends `POST /api/time-entries` with incomplete body
- **THEN** system returns 422 validation error

### Requirement: TimeEntry batch create
The system SHALL create multiple time entries in one request.

#### Scenario: Batch create time entries
- **WHEN** client sends `POST /api/time-entries/batch` with array of time entry objects
- **THEN** system returns 201 with array of created time entries, each with generated id and createdAt

### Requirement: TimeEntry update
The system SHALL update an existing time entry with partial data (excluding id and createdAt).

#### Scenario: Update existing time entry
- **WHEN** client sends `PUT /api/time-entries/1` with `{"hours": 6, "description": "更新描述"}`
- **THEN** system returns 200 with the updated time entry

#### Scenario: Update non-existent time entry
- **WHEN** client sends `PUT /api/time-entries/999` with data
- **THEN** system returns 404

### Requirement: TimeEntry delete
The system SHALL delete a time entry by ID.

#### Scenario: Delete existing time entry
- **WHEN** client sends `DELETE /api/time-entries/1`
- **THEN** system returns 200 with `{"success": true}`

#### Scenario: Delete non-existent time entry
- **WHEN** client sends `DELETE /api/time-entries/999`
- **THEN** system returns 404

### Requirement: TimeEntry submit for approval
The system SHALL change a time entry's approvalStatus to "待审批" and clear rejectReason.

#### Scenario: Submit time entry for approval
- **WHEN** client sends `PUT /api/time-entries/1/submit`
- **THEN** system returns 200 with the updated time entry having approvalStatus "待审批"

### Requirement: TimeEntry approve
The system SHALL approve a time entry, changing status to "已通过" and clearing rejectReason.

#### Scenario: Approve time entry
- **WHEN** client sends `PUT /api/time-entries/1/approve`
- **THEN** system returns 200 with the updated time entry having approvalStatus "已通过"

### Requirement: TimeEntry reject
The system SHALL reject a time entry with a reason.

#### Scenario: Reject time entry with reason
- **WHEN** client sends `PUT /api/time-entries/1/reject` with `{"reason": "工时填写不规范"}`
- **THEN** system returns 200 with the updated time entry having approvalStatus "已驳回" and rejectReason set

### Requirement: User list query
The system SHALL return a list of users with support for filtering by username and role.

#### Scenario: List all users
- **WHEN** client sends `GET /api/users`
- **THEN** system returns 200 with all users

#### Scenario: Filter by username
- **WHEN** client sends `GET /api/users?username=Admin`
- **THEN** system returns 200 with users matching "Admin" (case-insensitive fuzzy match)

#### Scenario: Filter by role
- **WHEN** client sends `GET /api/users?role=Administrator`
- **THEN** system returns 200 with users having role "Administrator"

### Requirement: User detail
The system SHALL return a single user by ID.

#### Scenario: Get existing user
- **WHEN** client sends `GET /api/users/1`
- **THEN** system returns 200 with the user object

#### Scenario: Get non-existent user
- **WHEN** client sends `GET /api/users/999`
- **THEN** system returns 404 with `{"message": "用户不存在"}`

### Requirement: User create
The system SHALL create a new user with generated id and createdAt.

#### Scenario: Create valid user
- **WHEN** client sends `POST /api/users` with `{"username": "NewUser", "password": "Pass@word0", "roles": ["User"]}`
- **THEN** system returns 201 with the created user including generated id and createdAt

### Requirement: User update
The system SHALL update a user's information (excluding password, id, createdAt).

#### Scenario: Update existing user
- **WHEN** client sends `PUT /api/users/3` with `{"roles": ["ProjectManager"]}`
- **THEN** system returns 200 with the updated user

### Requirement: User delete
The system SHALL delete a user by ID.

#### Scenario: Delete existing user
- **WHEN** client sends `DELETE /api/users/1`
- **THEN** system returns 200 with `{"success": true}`

### Requirement: User login
The system SHALL authenticate a user by username and password.

#### Scenario: Successful login
- **WHEN** client sends `POST /api/users/login` with `{"username": "Administrator", "password": "Pass@word0"}`
- **THEN** system returns 200 with the user object

#### Scenario: Failed login - wrong password
- **WHEN** client sends `POST /api/users/login` with `{"username": "Administrator", "password": "wrong"}`
- **THEN** system returns 401 with `{"message": "用户名或密码错误"}`

#### Scenario: Failed login - non-existent user
- **WHEN** client sends `POST /api/users/login` with `{"username": "NonExistent", "password": "Pass@word0"}`
- **THEN** system returns 401 with `{"message": "用户名或密码错误"}`

### Requirement: Role list
The system SHALL return all roles.

#### Scenario: List all roles
- **WHEN** client sends `GET /api/roles`
- **THEN** system returns 200 with all role objects

### Requirement: Role detail
The system SHALL return a single role by ID.

#### Scenario: Get existing role
- **WHEN** client sends `GET /api/roles/1`
- **THEN** system returns 200 with the role object

#### Scenario: Get non-existent role
- **WHEN** client sends `GET /api/roles/999`
- **THEN** system returns 404 with `{"message": "角色不存在"}`

### Requirement: Role create
The system SHALL create a new role with generated id.

#### Scenario: Create valid role
- **WHEN** client sends `POST /api/roles` with `{"name": "Developer", "permissions": ["TimeSheet.Read", "TimeSheet.Write"]}`
- **THEN** system returns 201 with the created role including generated id

### Requirement: Role update
The system SHALL update a role (partial, excluding id).

#### Scenario: Update existing role
- **WHEN** client sends `PUT /api/roles/3` with `{"permissions": ["TimeSheet.Read", "TimeSheet.Write", "TimeSheet.Export"]}`
- **THEN** system returns 200 with the updated role

### Requirement: Role delete
The system SHALL delete a role by ID, with protection for Administrator role.

#### Scenario: Delete existing role
- **WHEN** client sends `DELETE /api/roles/3`
- **THEN** system returns 200 with `{"success": true}`

#### Scenario: Delete Administrator role (forbidden)
- **WHEN** client sends `DELETE /api/roles/1`
- **THEN** system returns 403 with `{"message": "不能删除 Administrator 角色"}`

### Requirement: Data model - TimeEntry
The system SHALL use the TimeEntry data model with the following fields: id (string), projectName (string), description (string), hours (number), approvalStatus (string: "待审批"/"已通过"/"已驳回"), rejectReason (string | undefined), createdAt (string, ISO 8601).

#### Scenario: TimeEntry validation
- **WHEN** client creates a time entry
- **THEN** projectName, description, hours, and approvalStatus are required; hours must be > 0

### Requirement: Data model - User
The system SHALL use the User data model with the following fields: id (string), username (string), password (string), roles (string[]), createdAt (string, ISO 8601).

#### Scenario: User validation
- **WHEN** client creates a user
- **THEN** username, password, and roles are required

### Requirement: Data model - Role
The system SHALL use the Role data model with the following fields: id (string), name (string), permissions (string[]).

#### Scenario: Role validation
- **WHEN** client creates a role
- **THEN** name and permissions are required

### Requirement: Response format
The system SHALL follow the response format defined in web-api-design.md (in this change directory): success responses return business data directly; error responses return `{"message": "error info"}`.

#### Scenario: Success response format
- **WHEN** a GET request succeeds
- **THEN** system returns 200 with the data array or object directly

#### Scenario: Error response format
- **WHEN** an error occurs
- **THEN** system returns appropriate status code (401/403/404) with `{"message": "error info"}`

### Requirement: Swagger UI documentation
The system SHALL expose Swagger UI at `/docs` endpoint for interactive API documentation.

#### Scenario: Access Swagger UI
- **WHEN** client accesses `/docs`
- **THEN** system returns interactive Swagger UI with all API endpoints documented

#### Scenario: Access ReDoc
- **WHEN** client accesses `/redoc`
- **THEN** system returns ReDoc documentation
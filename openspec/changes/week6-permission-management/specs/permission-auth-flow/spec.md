## ADDED Requirements

### Requirement: Login page quick login update
The system SHALL update the login page quick login links from admin/user1/user2 to Administrator/ProjectManager/User.

#### Scenario: Quick login links
- **WHEN** user views the login page
- **THEN** quick login links show Administrator, ProjectManager, and User

#### Scenario: Quick login pre-fill
- **WHEN** user clicks a quick login link
- **THEN** the username field is pre-filled with the corresponding role name (Administrator/ProjectManager/User)

### Requirement: Unified default password
The system SHALL set the password for all default users to "Pass@word0".

#### Scenario: Administrator login
- **WHEN** user enters username "Administrator" and password "Pass@word0"
- **THEN** login succeeds

#### Scenario: ProjectManager login
- **WHEN** user enters username "ProjectManager" and password "Pass@word0"
- **THEN** login succeeds

#### Scenario: User login
- **WHEN** user enters username "User" and password "Pass@word0"
- **THEN** login succeeds

### Requirement: Token-based permission storage
The system SHALL store user roles and permissions in the token (Authorization header) after successful login.

#### Scenario: Token after login
- **WHEN** a user successfully logs in
- **THEN** the httpClient sets `config.headers.Authorization = 'Bearer mock-token'` and the token payload contains user roles and permissions

#### Scenario: Permissions available to components
- **WHEN** a component needs to check permissions
- **THEN** it can read the user's permissions from the Redux store or token

### Requirement: Permission-driven routing
The system SHALL control page access based on permissions stored in the token/user state.

#### Scenario: Access with permission
- **WHEN** a logged-in user has the required permission
- **THEN** the user can access the page normally

#### Scenario: Access without permission
- **WHEN** a logged-in user lacks the required permission
- **THEN** the user is redirected to the 403 page

#### Scenario: Direct URL access without permission
- **WHEN** a user directly enters a URL for a page they lack permission for
- **THEN** the user is redirected to the 403 page
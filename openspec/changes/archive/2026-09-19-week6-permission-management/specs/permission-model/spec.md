## ADDED Requirements

### Requirement: Permission entity definition
The system SHALL define Permission as a string-type identifier representing granular access rights.

#### Scenario: Permission identifier format
- **WHEN** a permission is defined
- **THEN** it follows the format `{Domain}.{Action}` (e.g., "TimeSheet.Read", "User.Write")

#### Scenario: All required permissions are defined
- **WHEN** the system initializes
- **THEN** the following 9 permissions exist: TimeSheet.Read, TimeSheet.Write, TimeSheet.Export, TimeSheet.Import, TimeSheet.approval, User.Read, User.Write, Role.Read, Role.Write

### Requirement: Role entity definition
The system SHALL define Role with id, name, and permissions array. Each role contains a list of Permission identifiers.

#### Scenario: Role structure
- **WHEN** a role is defined
- **THEN** it has id (string), name (RoleName type), and permissions (Permission[])

#### Scenario: RoleName type values
- **WHEN** the RoleName type is defined
- **THEN** it includes exactly three values: 'Administrator', 'ProjectManager', 'User'

### Requirement: User entity with multi-role support
The system SHALL define User with roles as an array of UserRole strings, supporting 1:n relationship between User and Role.

#### Scenario: User roles field
- **WHEN** a User is defined
- **THEN** it has a `roles: UserRole[]` field

#### Scenario: User Role relationship
- **WHEN** a user is assigned roles
- **THEN** the user can have multiple roles (1:n relationship)

### Requirement: Default roles with permission assignments
The system SHALL create three default roles with predefined permission sets.

#### Scenario: User role permissions
- **WHEN** the User role is defined
- **THEN** it has permissions: TimeSheet.Read, TimeSheet.Write

#### Scenario: ProjectManager role permissions
- **WHEN** the ProjectManager role is defined
- **THEN** it has permissions: TimeSheet.Read, TimeSheet.Write, TimeSheet.Export, TimeSheet.Import, TimeSheet.approval, User.Read, User.Write

#### Scenario: Administrator role permissions
- **WHEN** the Administrator role is defined
- **THEN** it has permissions: TimeSheet.Read, User.Read, User.Write, Role.Read, Role.Write

### Requirement: Default users
The system SHALL create three default users, one for each role, with username matching the role name.

#### Scenario: Default user creation
- **WHEN** the system initializes default data
- **THEN** three users exist: Administrator (role: Administrator), ProjectManager (role: ProjectManager), User (role: User)

#### Scenario: Default user password
- **WHEN** a default user authenticates
- **THEN** the password for all default users is "Pass@word0"
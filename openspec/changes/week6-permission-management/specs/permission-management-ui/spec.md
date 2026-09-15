## ADDED Requirements

### Requirement: Permission management page (role list)
The system SHALL provide a permission management page with a table displaying roles and a delete button for each role.

#### Scenario: Role list table display
- **WHEN** user navigates to the permission management page
- **THEN** a table displays all roles with their names and a delete button

#### Scenario: Administrator role cannot be deleted
- **WHEN** user views the permission management page
- **THEN** the delete button for the Administrator role is disabled/inactive

#### Scenario: Non-Administrator role deletion
- **WHEN** user clicks the delete button for a non-Administrator role
- **THEN** a confirmation dialog appears, and upon confirmation the role is deleted

#### Scenario: Add role button and card
- **WHEN** user views the permission management page
- **THEN** an "Add Role" button and card are displayed, clicking navigates to the role creation page

### Requirement: Permission assignment page
The system SHALL provide a permission assignment page using Ant Design Select component (mode="multiple") for assigning permissions to roles.

#### Scenario: Select component layout
- **WHEN** user opens the permission assignment page for a role
- **THEN** the Ant Design Select component displays with a dropdown showing all available permissions, and selected permissions are shown as tags

#### Scenario: New role creation with permission assignment
- **WHEN** user clicks "Add Role" button
- **THEN** the user can enter a role name and use the Select component to assign permissions before saving

#### Scenario: Edit role permission assignment
- **WHEN** user edits an existing role
- **THEN** the Select component shows current permissions as selected options

#### Scenario: Permission assignment interaction
- **WHEN** user selects or deselects permissions in the Select component
- **THEN** the selected permissions list updates in real time
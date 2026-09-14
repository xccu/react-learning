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
The system SHALL provide a permission assignment page using Ant Design Transfer component for assigning permissions to roles.

#### Scenario: Transfer component layout
- **WHEN** user opens the permission assignment page for a role
- **THEN** the Ant Design Transfer component displays with left panel showing unassigned permissions and right panel showing assigned permissions

#### Scenario: New role creation with permission assignment
- **WHEN** user clicks "Add Role" button
- **THEN** the user can enter a role name and use the Transfer component to assign permissions before saving

#### Scenario: Edit role permission assignment
- **WHEN** user edits an existing role
- **THEN** the Transfer component shows current permissions in the right panel and unassigned permissions in the left panel

#### Scenario: Permission transfer interaction
- **WHEN** user drags or moves permissions between panels in the Transfer component
- **THEN** the right panel reflects assigned permissions and the left panel reflects unassigned permissions
## Purpose
Define requirements for persisting time entry, user, and role data to JSON files on disk.

## Requirements

### Requirement: TimeEntry persistence on create
The system SHALL write the new time entry to time_entries.json immediately after creation.

#### Scenario: Create time entry and persist
- **WHEN** client sends `POST /api/time-entries` with valid data
- **THEN** system returns 201 with the created entry AND the data is written to data/time_entries.json

#### Scenario: Server restart preserves created entry
- **WHEN** server is restarted after creating entries
- **THEN** the previously created entries are loaded from data/time_entries.json

### Requirement: TimeEntry persistence on update
The system SHALL write the updated time entry to time_entries.json immediately after update.

#### Scenario: Update time entry and persist
- **WHEN** client sends `PUT /api/time-entries/{id}` with updates
- **THEN** system returns 200 with the updated entry AND the data is written to data/time_entries.json

### Requirement: TimeEntry persistence on delete
The system SHALL write the updated list to time_entries.json immediately after deletion.

#### Scenario: Delete time entry and persist
- **WHEN** client sends `DELETE /api/time-entries/{id}`
- **THEN** system returns 200 with `{"success": true}` AND the entry is removed from data/time_entries.json

### Requirement: TimeEntry persistence on batch create
The system SHALL write all batch entries to time_entries.json immediately after creation.

#### Scenario: Batch create and persist
- **WHEN** client sends `POST /api/time-entries/batch` with array
- **THEN** system returns 201 with all created entries AND all entries are written to data/time_entries.json

### Requirement: TimeEntry persistence on approve/reject/submit
The system SHALL write the status change to time_entries.json immediately.

#### Scenario: Approve and persist
- **WHEN** client sends `PUT /api/time-entries/{id}/approve`
- **THEN** system returns 200 with updated entry AND the status change is written to data/time_entries.json

#### Scenario: Reject and persist
- **WHEN** client sends `PUT /api/time-entries/{id}/reject` with reason
- **THEN** system returns 200 with updated entry AND the status + reason are written to data/time_entries.json

### Requirement: User persistence on create
The system SHALL write the new user to users.json immediately after creation.

#### Scenario: Create user and persist
- **WHEN** client sends `POST /api/users` with valid data
- **THEN** system returns 201 with the created user AND the data is written to data/users.json

### Requirement: User persistence on update
The system SHALL write the updated user to users.json immediately after update.

#### Scenario: Update user and persist
- **WHEN** client sends `PUT /api/users/{id}` with updates
- **THEN** system returns 200 with the updated user AND the data is written to data/users.json

### Requirement: User persistence on delete
The system SHALL write the updated list to users.json immediately after deletion.

#### Scenario: Delete user and persist
- **WHEN** client sends `DELETE /api/users/{id}`
- **THEN** system returns 200 with `{"success": true}` AND the user is removed from data/users.json

### Requirement: Role persistence on create
The system SHALL write the new role to roles.json immediately after creation.

#### Scenario: Create role and persist
- **WHEN** client sends `POST /api/roles` with valid data
- **THEN** system returns 201 with the created role AND the data is written to data/roles.json

### Requirement: Role persistence on update
The system SHALL write the updated role to roles.json immediately after update.

#### Scenario: Update role and persist
- **WHEN** client sends `PUT /api/roles/{id}` with updates
- **THEN** system returns 200 with the updated role AND the data is written to data/roles.json

### Requirement: Role persistence on delete
The system SHALL write the updated list to roles.json immediately after deletion.

#### Scenario: Delete role and persist
- **WHEN** client sends `DELETE /api/roles/{id}`
- **THEN** system returns 200 with `{"success": true}` AND the role is removed from data/roles.json
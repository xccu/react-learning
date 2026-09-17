## Purpose
Define requirements for backing up and restoring JSON data files.

## Requirements

### Requirement: Initial data backup
The system SHALL copy original JSON files to data/initial/ directory.

#### Scenario: Backup initial files
- **WHEN** backup_data.py is executed
- **THEN** data/time_entries.json, data/users.json, data/roles.json are copied to data/initial/

### Requirement: Runtime data backup
The system SHALL copy current JSON files to data/backup/ directory before loading.

#### Scenario: Backup before server start
- **WHEN** backup_data.py is executed
- **THEN** current data files are copied to data/backup/ with timestamp

### Requirement: Data restore via batch script
The system SHALL restore JSON files from data/initial/ when restore_data.bat is executed.

#### Scenario: Restore initial data
- **WHEN** restore_data.bat is executed
- **THEN** data/time_entries.json, data/users.json, data/roles.json are overwritten with data/initial/ copies

#### Scenario: Restore confirms success
- **WHEN** restore_data.bat completes
- **THEN** system displays "Data restored successfully" message
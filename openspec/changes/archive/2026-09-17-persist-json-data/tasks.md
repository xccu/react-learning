## 1. Data Persistence Module

- [ ] 1.1 Update data_loader.py to add save_time_entries(), save_users(), save_roles() functions
- [ ] 1.2 Add error handling for JSON write failures

## 2. TimeEntry Persistence

- [ ] 2.1 Add persistence to POST /api/time-entries (create)
- [x] 2.2 Add persistence to POST /api/time-entries/batch (batch create)
- [ ] 2.3 Add persistence to PUT /api/time-entries/{id} (update)
- [ ] 2.4 Add persistence to DELETE /api/time-entries/{id} (delete)
- [ ] 2.5 Add persistence to PUT /api/time-entries/{id}/approve (approve)
- [ ] 2.6 Add persistence to PUT /api/time-entries/{id}/reject (reject)
- [ ] 2.7 Add persistence to PUT /api/time-entries/{id}/submit (submit)

## 3. User Persistence

- [ ] 3.1 Add persistence to POST /api/users (create)
- [ ] 3.2 Add persistence to PUT /api/users/{id} (update)
- [ ] 3.3 Add persistence to DELETE /api/users/{id} (delete)

## 4. Role Persistence

- [ ] 4.1 Add persistence to POST /api/roles (create)
- [ ] 4.2 Add persistence to PUT /api/roles/{id} (update)
- [ ] 4.3 Add persistence to DELETE /api/roles/{id} (delete)

## 5. Backup and Restore

- [ ] 5.1 Create data/initial/ directory and copy initial JSON files
- [ ] 5.2 Create data/backup/ directory
- [ ] 5.3 Create backup_data.py to backup current data to data/backup/
- [ ] 5.4 Create restore_data.py to restore data from data/initial/
- [x] 5.5 Create restore_data.bat to execute restore_data.py
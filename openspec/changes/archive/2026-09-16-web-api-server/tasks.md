## 1. Project Setup

- [x] 1.1 Create web-api-server directory structure
- [x] 1.2 Create requirements.txt with FastAPI and uvicorn dependencies
- [x] 1.3 Create Python virtual environment and install dependencies

## 2. Data Models

- [x] 2.1 Define Pydantic models for TimeEntry (create, update, response)
- [x] 2.2 Define Pydantic models for User (create, update, response)
- [x] 2.3 Define Pydantic models for Role (create, update, response)

## 3. Initial Data Files

- [x] 3.1 Create data/time_entries.json with 3 initial records
- [x] 3.2 Create data/users.json with 3 initial users (Administrator, ProjectManager, User)
- [x] 3.3 Create data/roles.json with 3 initial roles (Administrator, ProjectManager, User)
- [x] 3.4 Implement data_loader.py to load JSON files on startup

## 4. TimeEntry Endpoints

- [x] 4.1 Implement GET /api/time-entries with query filtering (projectName, description, approvalStatus)
- [x] 4.2 Implement GET /api/time-entries/{id}
- [x] 4.3 Implement POST /api/time-entries
- [x] 4.4 Implement POST /api/time-entries/batch
- [x] 4.5 Implement PUT /api/time-entries/{id}
- [x] 4.6 Implement DELETE /api/time-entries/{id}
- [x] 4.7 Implement PUT /api/time-entries/{id}/submit
- [x] 4.8 Implement PUT /api/time-entries/{id}/approve
- [x] 4.9 Implement PUT /api/time-entries/{id}/reject

## 5. User Endpoints

- [x] 5.1 Implement GET /api/users with query filtering (username, role)
- [x] 5.2 Implement GET /api/users/{id}
- [x] 5.3 Implement POST /api/users
- [x] 5.4 Implement PUT /api/users/{id}
- [x] 5.5 Implement DELETE /api/users/{id}
- [x] 5.6 Implement POST /api/users/login

## 6. Role Endpoints

- [x] 6.1 Implement GET /api/roles
- [x] 6.2 Implement GET /api/roles/{id}
- [x] 6.3 Implement POST /api/roles
- [x] 6.4 Implement PUT /api/roles/{id}
- [x] 6.5 Implement DELETE /api/roles/{id} with Administrator protection

## 7. Application Entry Point

- [x] 7.1 Create main.py with FastAPI app instance
- [x] 7.2 Register all API routes
- [x] 7.3 Configure CORS middleware (allow react-app origin)
- [x] 7.4 Configure custom response format for errors
- [x] 7.5 Add startup message with Swagger UI URL

## 8. Testing

- [ ] 8.1 Start server and verify Swagger UI at /docs
- [ ] 8.2 Test all TimeEntry endpoints via Swagger UI
- [ ] 8.3 Test all User endpoints via Swagger UI
- [ ] 8.4 Test all Role endpoints via Swagger UI
- [ ] 8.5 Verify error responses (404, 401, 403)
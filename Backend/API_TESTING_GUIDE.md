# E-VEDA API Testing Guide

This guide provides everything you need to test the implemented **Authentication** and **User Profile** APIs using tools like **Bruno**, **Postman**, or `curl`.

## 🌐 Configuration

- **Base URL**: `http://localhost:8080/api`
- **Content-Type**: `application/json`
- **Auth Strategy**: JWT Bearer Token in `Authorization` header.

---

## 🔐 Authentication APIs

### 1. User Signup
**Endpoint**: `POST /auth/signup`
- **Request Payload**:
  ```json
  {
    "email": "tester@example.com",
    "password": "SecurePassword123!",
    "confirmPassword": "SecurePassword123!"
  }
  ```
- **Expected Result**: `201 Created` with tokens and user UUID.

### 2. User Login
**Endpoint**: `POST /auth/login`
- **Request Payload**:
  ```json
  {
    "email": "tester@example.com",
    "password": "SecurePassword123!"
  }
  ```
- **Expected Result**: `200 OK` with `token` and `refreshToken`.

### 3. Token Refresh
**Endpoint**: `POST /auth/refresh-token`
- **Request Payload**:
  ```json
  {
    "refreshToken": "{your_refresh_token_here}"
  }
  ```
- **Expected Result**: `200 OK` with a new `token`.

### 4. Logout
**Endpoint**: `POST /auth/logout`
- **Headers**: `Authorization: Bearer {token}`
- **Expected Result**: `200 OK`. Token is blacklisted.

---

## 👤 User Profile APIs

### 1. Get Profile
**Endpoint**: `GET /users/profile`
- **Headers**: `Authorization: Bearer {token}`
- **Expected Result**: `200 OK` with full profile data (merged from IAM and User services).

### 2. Update Profile
**Endpoint**: `PUT /users/profile`
- **Headers**: `Authorization: Bearer {token}`
- **Request Payload**:
  ```json
  {
    "fullName": "Test User",
    "nickname": "tester",
    "age": 30,
    "gender": "Non-binary",
    "phoneNumber": "+1234567890",
    "address": "123 Tech Avenue",
    "dateOfBirth": "1994-01-01",
    "medicalHistory": [
      {
        "condition": "Healthy",
        "status": "Active"
      }
    ],
    "emergencyContact": {
      "name": "Jane Doe",
      "relationship": "Friend",
      "phone": "9876543210"
    }
  }
  ```

### 3. Change Password
**Endpoint**: `POST /users/change-password`
- **Headers**: `Authorization: Bearer {token}`
- **Request Payload**:
  ```json
  {
    "currentPassword": "SecurePassword123!",
    "newPassword": "EvenMoreSecure456!",
    "confirmPassword": "EvenMoreSecure456!"
  }
  ```

---

## 🧪 Recommended Test Scenarios

| Step | Action | Endpoint | Validation |
|------|--------|----------|------------|
| 1 | Register new user | `/auth/signup` | Status 201, capture tokens. |
| 2 | Login | `/auth/login` | Status 200, tokens match or are valid. |
| 3 | Fetch Initial Profile | `/users/profile` | Verify profile is empty/default. |
| 4 | Update Profile | `/users/profile` | Status 200, verify data in response. |
| 5 | Verify Persistence | `/users/profile` | Call GET again, ensure data is saved. |
| 6 | Change Password | `/users/change-password` | Status 200. |
| 7 | Verify PW Change | `/auth/login` | Login with OLD password (should fail 401). |
| 8 | Logout | `/auth/logout` | Status 200. |
| 9 | Verify Invalidation | `/users/profile` | Subsequent call should fail 401. |

---

> [!IMPORTANT]
> **WSL Network Note**: If you are running Bruno on Windows and the backend is in WSL, use `localhost:8080`. If `localhost` doesn't resolve, use the WSL IP address (found via `hostname -I`).

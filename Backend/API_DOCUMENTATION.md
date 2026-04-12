# E-VEDA Frontend - API Documentation

## Overview
E-VEDA (Emotion Video & Audio Diagnosis Assistant) is a comprehensive healthcare platform that combines cutting-edge technology with compassionate care. This document provides detailed API endpoint documentation for integrating the frontend with backend services.

**Application Name:** E-VEDA  
**Version:** 0.1.0  
**Base URL:** `http://localhost:8080/api` (Development) | `https://api.eveda.com` (Production)  
**Frontend Framework:** React 18.2.0  

---

## 🏗️ Project Structure

```
Frontend/
├── src/
│   ├── Components/
│   │   ├── WelcomePage.js      # Landing page
│   │   ├── LoginPage.js         # User authentication login
│   │   ├── SignUpPage.js        # User registration
│   │   ├── HomePage.js          # Main information page
│   │   ├── Dashboard.js         # User dashboard with analytics
│   │   ├── NewReport.js         # Medical report generation
│   │   └── Navbar.js            # Navigation component
│   ├── Styles/                  # CSS stylesheets
│   ├── Assets/                  # Images and media
│   ├── App.js                   # Main App component
│   └── index.js                 # React entry point
├── public/
│   ├── index.html
│   └── manifest.json
└── package.json
```

---

## 📋 Application Routes

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | WelcomePage | Landing page with introduction |
| `/login` | LoginPage | User login form |
| `/signup` | SignUpPage | User registration form |
| `/homepage` | HomePage | Main information & features page |
| `/dashboard` | Dashboard | User dashboard with health analytics |

---

## 🔐 Authentication API

### 1. User Login
**Endpoint:** `POST /auth/login`

**Description:** Authenticate user with username/email and password

**Request Body:**
```json
{
  "username": "user@email.com",
  "password": "securePassword123"
}
```

**Request Parameters:**
- `username` (string, required): Username or email address
- `password` (string, required): User password

**Success Response (200 OK):**
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "userId": "USR_12345",
    "username": "user@email.com",
    "email": "user@email.com",
    "fullName": "John Doe",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "status": "error",
  "message": "Invalid username or password",
  "code": "INVALID_CREDENTIALS"
}
```

**Status Codes:**
- `200` - Login successful
- `400` - Missing required fields
- `401` - Invalid credentials
- `429` - Too many login attempts

---

### 2. User Registration (Sign Up)
**Endpoint:** `POST /auth/signup`

**Description:** Create a new user account

**Request Body:**
```json
{
  "email": "newuser@email.com",
  "username": "newuser",
  "password": "securePassword123",
  "confirmPassword": "securePassword123"
}
```

**Request Parameters:**
- `email` (string, required): Valid email address
- `username` (string, required): Unique username (3-20 characters)
- `password` (string, required): Password (min 8 characters, 1 uppercase, 1 number, 1 special char)
- `confirmPassword` (string, required): Must match password

**Success Response (201 Created):**
```json
{
  "status": "success",
  "message": "Account created successfully",
  "data": {
    "userId": "USR_12346",
    "username": "newuser",
    "email": "newuser@email.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "status": "error",
  "message": "Email already exists",
  "code": "EMAIL_EXISTS"
}
```

**Status Codes:**
- `201` - Account created successfully
- `400` - Validation error / Passwords don't match
- `409` - Email or username already exists
- `422` - Unprocessable entity

---

### 3. Logout
**Endpoint:** `POST /auth/logout`

**Description:** Invalidate user session and tokens

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "message": "Logged out successfully"
}
```

**Status Codes:**
- `200` - Logout successful
- `401` - Unauthorized (invalid/expired token)

---

### 4. Refresh Token
**Endpoint:** `POST /auth/refresh-token`

**Description:** Generate new access token using refresh token

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "message": "Token refreshed",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  }
}
```

**Status Codes:**
- `200` - Token refreshed successfully
- `401` - Invalid or expired refresh token

---

### 5. Forgot Password
**Endpoint:** `POST /auth/forgot-password`

**Description:** Request password reset link

**Request Body:**
```json
{
  "email": "user@email.com"
}
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "message": "Reset link sent to your email",
  "data": {
    "resetToken": "abc123xyz789"
  }
}
```

**Status Codes:**
- `200` - Reset email sent
- `400` - Invalid email format
- `404` - Email not found

---

### 6. Reset Password
**Endpoint:** `POST /auth/reset-password`

**Description:** Reset password using reset token

**Request Body:**
```json
{
  "token": "abc123xyz789",
  "newPassword": "newSecurePassword123",
  "confirmPassword": "newSecurePassword123"
}
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "message": "Password reset successfully"
}
```

**Status Codes:**
- `200` - Password reset successful
- `400` - Invalid token or validation error
- `401` - Token expired

---

## 📊 Dashboard API

### 1. Get Dashboard Data
**Endpoint:** `GET /dashboard/overview`

**Description:** Retrieve dashboard overview with health metrics and emotion data

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `date` (string, optional): Date filter (Today, Yesterday, This Week, This Month)

**Success Response (200 OK):**
```json
{
  "status": "success",
  "message": "Dashboard data retrieved",
  "data": {
    "userId": "USR_12345",
    "userName": "John Doe",
    "selectedDate": "Today",
    "emotionData": [
      {
        "time": 0,
        "joy": 38,
        "anger": 28,
        "nervousness": 35,
        "sadness": 25
      },
      {
        "time": 5,
        "joy": 55,
        "anger": 45,
        "nervousness": 42,
        "sadness": 22
      }
    ],
    "healthMetrics": {
      "heartRate": "72 bpm",
      "bloodPressure": "120/80",
      "temperature": "98.6°F",
      "oxygenLevel": "98%",
      "stressLevel": "Low"
    },
    "recentReports": [
      {
        "reportId": "RPT_001",
        "date": "2024-04-11",
        "type": "Routine Checkup",
        "status": "Completed"
      }
    ]
  }
}
```

**Status Codes:**
- `200` - Data retrieved successfully
- `401` - Unauthorized
- `404` - User not found

---

## 📋 Medical Reports API

### 1. Create New Medical Report
**Endpoint:** `POST /reports/create`

**Description:** Create a new medical report with facial and voice recognition

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Body (multipart):**
- `videoFile` (file, required): Facial recognition video (MP4, AVI, MOV)
- `audioFile` (file, required): Voice recognition audio (MP3, WAV, OGG)
- `reportType` (string, required): Type of report (Routine, Emergency, Follow-up)
- `symptoms` (string, optional): Reported symptoms
- `notes` (string, optional): Additional notes

**Success Response (201 Created):**
```json
{
  "status": "success",
  "message": "Report created successfully",
  "data": {
    "reportId": "RPT_12345",
    "userId": "USR_12345",
    "reportType": "Routine",
    "createdAt": "2024-04-11T10:30:00Z",
    "analysisStatus": "Processing",
    "facialAnalysis": {
      "emotions": {
        "joy": 38,
        "anger": 28,
        "nervousness": 35,
        "sadness": 25
      },
      "facialExpressions": ["detected", "analyzed"]
    },
    "voiceAnalysis": {
      "emotions": {
        "joy": 40,
        "anger": 25,
        "nervousness": 30,
        "sadness": 20
      },
      "audioQuality": "Good",
      "duration": "45 seconds"
    },
    "healthMetrics": {
      "heartRate": "72 bpm",
      "bloodPressure": "120/80",
      "temperature": "98.6°F",
      "oxygenLevel": "98%",
      "stressLevel": "Low"
    }
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "status": "error",
  "message": "File size exceeds limit",
  "code": "FILE_SIZE_EXCEEDED"
}
```

**Status Codes:**
- `201` - Report created successfully
- `400` - Invalid file format or size
- `401` - Unauthorized
- `413` - Payload too large

---

### 2. Get Report Details
**Endpoint:** `GET /reports/{reportId}`

**Description:** Retrieve detailed information about a specific report

**Headers:**
```
Authorization: Bearer {token}
```

**URL Parameters:**
- `reportId` (string, required): ID of the report

**Success Response (200 OK):**
```json
{
  "status": "success",
  "message": "Report retrieved successfully",
  "data": {
    "reportId": "RPT_12345",
    "userId": "USR_12345",
    "reportType": "Routine",
    "createdAt": "2024-04-11T10:30:00Z",
    "updatedAt": "2024-04-11T10:35:00Z",
    "analysisStatus": "Completed",
    "facialAnalysis": {
      "emotions": {
        "joy": 38,
        "anger": 28,
        "nervousness": 35,
        "sadness": 25
      },
      "facialExpressions": ["detected", "analyzed"],
      "skinCondition": "Healthy"
    },
    "voiceAnalysis": {
      "emotions": {
        "joy": 40,
        "anger": 25,
        "nervousness": 30,
        "sadness": 20
      },
      "audioQuality": "Good",
      "duration": "45 seconds",
      "speechRate": "Normal"
    },
    "healthMetrics": {
      "heartRate": "72 bpm",
      "bloodPressure": "120/80",
      "temperature": "98.6°F",
      "oxygenLevel": "98%",
      "stressLevel": "Low"
    },
    "aiDiagnosis": {
      "suggestion": "Patient appears healthy",
      "recommendedActions": ["Continue regular checkups"],
      "confidenceScore": 0.92
    }
  }
}
```

**Status Codes:**
- `200` - Report retrieved successfully
- `401` - Unauthorized
- `404` - Report not found

---

### 3. Get All Reports
**Endpoint:** `GET /reports`

**Description:** Retrieve list of all reports for the authenticated user

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (integer, optional): Page number (default: 1)
- `limit` (integer, optional): Items per page (default: 10, max: 50)
- `sortBy` (string, optional): Sort field (createdAt, reportType, status)
- `order` (string, optional): Sort order (asc, desc)
- `status` (string, optional): Filter by status (Processing, Completed, Failed)

**Success Response (200 OK):**
```json
{
  "status": "success",
  "message": "Reports retrieved successfully",
  "data": {
    "totalCount": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3,
    "reports": [
      {
        "reportId": "RPT_12345",
        "reportType": "Routine",
        "createdAt": "2024-04-11T10:30:00Z",
        "status": "Completed",
        "healthMetrics": {
          "heartRate": "72 bpm",
          "bloodPressure": "120/80"
        }
      },
      {
        "reportId": "RPT_12346",
        "reportType": "Follow-up",
        "createdAt": "2024-04-10T14:15:00Z",
        "status": "Completed",
        "healthMetrics": {
          "heartRate": "75 bpm",
          "bloodPressure": "122/82"
        }
      }
    ]
  }
}
```

**Status Codes:**
- `200` - Reports retrieved successfully
- `401` - Unauthorized

---

### 4. Delete Report
**Endpoint:** `DELETE /reports/{reportId}`

**Description:** Delete a specific report

**Headers:**
```
Authorization: Bearer {token}
```

**URL Parameters:**
- `reportId` (string, required): ID of the report to delete

**Success Response (200 OK):**
```json
{
  "status": "success",
  "message": "Report deleted successfully"
}
```

**Status Codes:**
- `200` - Report deleted successfully
- `401` - Unauthorized
- `404` - Report not found

---

## 👤 User Profile API

### 1. Get User Profile
**Endpoint:** `GET /users/profile`

**Description:** Retrieve authenticated user's profile information

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "message": "Profile retrieved successfully",
  "data": {
    "userId": "USR_12345",
    "username": "john_doe",
    "email": "john@email.com",
    "fullName": "John Doe",
    "dateOfBirth": "1990-05-15",
    "gender": "Male",
    "phoneNumber": "+1-555-123-4567",
    "address": "123 Health Street, Medical City",
    "medicalHistory": [
      {
        "condition": "Hypertension",
        "diagnosedDate": "2019-03-20",
        "status": "Managed"
      }
    ],
    "emergencyContact": {
      "name": "Jane Doe",
      "relationship": "Spouse",
      "phone": "+1-555-123-4568"
    },
    "createdAt": "2023-01-15T08:00:00Z",
    "lastLogin": "2024-04-11T09:30:00Z"
  }
}
```

**Status Codes:**
- `200` - Profile retrieved successfully
- `401` - Unauthorized

---

### 2. Update User Profile
**Endpoint:** `PUT /users/profile`

**Description:** Update user profile information

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "fullName": "John Doe",
  "phoneNumber": "+1-555-123-4567",
  "address": "123 Health Street, Medical City",
  "gender": "Male",
  "dateOfBirth": "1990-05-15"
}
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "message": "Profile updated successfully",
  "data": {
    "userId": "USR_12345",
    "username": "john_doe",
    "email": "john@email.com",
    "fullName": "John Doe",
    "phoneNumber": "+1-555-123-4567",
    "address": "123 Health Street, Medical City",
    "updatedAt": "2024-04-11T10:45:00Z"
  }
}
```

**Status Codes:**
- `200` - Profile updated successfully
- `400` - Validation error
- `401` - Unauthorized

---

### 3. Change Password
**Endpoint:** `POST /users/change-password`

**Description:** Change user password

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword123",
  "confirmPassword": "newPassword123"
}
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "message": "Password changed successfully"
}
```

**Error Response (400 Bad Request):**
```json
{
  "status": "error",
  "message": "Current password is incorrect",
  "code": "INVALID_CURRENT_PASSWORD"
}
```

**Status Codes:**
- `200` - Password changed successfully
- `400` - Validation error or incorrect current password
- `401` - Unauthorized

---

## 📱 Health Metrics API

### 1. Get Health Metrics
**Endpoint:** `GET /health-metrics`

**Description:** Retrieve user's health metrics

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `dateFrom` (string, optional): Start date (ISO 8601 format)
- `dateTo` (string, optional): End date (ISO 8601 format)
- `metricType` (string, optional): Type of metric (heartRate, bloodPressure, temperature, oxygenLevel, stressLevel)

**Success Response (200 OK):**
```json
{
  "status": "success",
  "message": "Health metrics retrieved",
  "data": {
    "userId": "USR_12345",
    "metrics": [
      {
        "metricId": "MTR_001",
        "type": "heartRate",
        "value": 72,
        "unit": "bpm",
        "timestamp": "2024-04-11T10:30:00Z",
        "status": "Normal"
      },
      {
        "metricId": "MTR_002",
        "type": "bloodPressure",
        "value": "120/80",
        "unit": "mmHg",
        "timestamp": "2024-04-11T10:30:00Z",
        "status": "Normal"
      },
      {
        "metricId": "MTR_003",
        "type": "temperature",
        "value": 98.6,
        "unit": "°F",
        "timestamp": "2024-04-11T10:30:00Z",
        "status": "Normal"
      },
      {
        "metricId": "MTR_004",
        "type": "oxygenLevel",
        "value": 98,
        "unit": "%",
        "timestamp": "2024-04-11T10:30:00Z",
        "status": "Normal"
      },
      {
        "metricId": "MTR_005",
        "type": "stressLevel",
        "value": "Low",
        "unit": "level",
        "timestamp": "2024-04-11T10:30:00Z",
        "status": "Good"
      }
    ]
  }
}
```

**Status Codes:**
- `200` - Metrics retrieved successfully
- `401` - Unauthorized

---

### 2. Record Health Metric
**Endpoint:** `POST /health-metrics`

**Description:** Record a new health metric

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "metricType": "heartRate",
  "value": 72,
  "unit": "bpm",
  "timestamp": "2024-04-11T10:30:00Z"
}
```

**Success Response (201 Created):**
```json
{
  "status": "success",
  "message": "Health metric recorded",
  "data": {
    "metricId": "MTR_001",
    "userId": "USR_12345",
    "metricType": "heartRate",
    "value": 72,
    "unit": "bpm",
    "timestamp": "2024-04-11T10:30:00Z",
    "status": "Normal"
  }
}
```

**Status Codes:**
- `201` - Metric recorded successfully
- `400` - Validation error
- `401` - Unauthorized

---

## 🏥 Doctor/Consultation API

### 1. Get Available Doctors
**Endpoint:** `GET /doctors`

**Description:** Retrieve list of available doctors

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `specialty` (string, optional): Filter by specialty
- `available` (boolean, optional): Show only available doctors
- `rating` (number, optional): Minimum rating (1-5)
- `page` (integer, optional): Page number (default: 1)

**Success Response (200 OK):**
```json
{
  "status": "success",
  "message": "Doctors retrieved successfully",
  "data": {
    "totalCount": 45,
    "page": 1,
    "doctors": [
      {
        "doctorId": "DOC_001",
        "name": "Dr. Smith",
        "specialty": "Cardiology",
        "rating": 4.8,
        "reviews": 234,
        "yearsExperience": 12,
        "isAvailable": true,
        "nextAvailableSlot": "2024-04-12T14:00:00Z",
        "consultationFee": 50
      }
    ]
  }
}
```

**Status Codes:**
- `200` - Doctors retrieved successfully
- `401` - Unauthorized

---

### 2. Book Consultation
**Endpoint:** `POST /consultations/book`

**Description:** Book a consultation with a doctor

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "doctorId": "DOC_001",
  "appointmentDate": "2024-04-12T14:00:00Z",
  "consultationType": "Video",
  "reason": "Regular checkup"
}
```

**Success Response (201 Created):**
```json
{
  "status": "success",
  "message": "Consultation booked successfully",
  "data": {
    "consultationId": "CON_12345",
    "doctorId": "DOC_001",
    "doctorName": "Dr. Smith",
    "appointmentDate": "2024-04-12T14:00:00Z",
    "consultationType": "Video",
    "status": "Confirmed",
    "zoomLink": "https://zoom.us/j/123456789",
    "confirmationNumber": "EVEDA-2024-0412-001"
  }
}
```

**Status Codes:**
- `201` - Consultation booked successfully
- `400` - Validation error / Time slot unavailable
- `401` - Unauthorized

---

## 🔔 Notification API

### 1. Get Notifications
**Endpoint:** `GET /notifications`

**Description:** Retrieve user's notifications

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `limit` (integer, optional): Number of notifications (default: 20)
- `unreadOnly` (boolean, optional): Show only unread notifications

**Success Response (200 OK):**
```json
{
  "status": "success",
  "message": "Notifications retrieved",
  "data": {
    "unreadCount": 3,
    "notifications": [
      {
        "notificationId": "NOT_001",
        "type": "ReportCompleted",
        "title": "Report Analysis Completed",
        "message": "Your medical report has been analyzed",
        "timestamp": "2024-04-11T10:30:00Z",
        "isRead": false,
        "actionUrl": "/reports/RPT_12345"
      }
    ]
  }
}
```

**Status Codes:**
- `200` - Notifications retrieved successfully
- `401` - Unauthorized

---

## 🔄 Common Response Format

All API responses follow this standard format:

### Success Response
```json
{
  "status": "success",
  "message": "Description of successful operation",
  "data": {
    "key": "value"
  }
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Description of error",
  "code": "ERROR_CODE",
  "timestamp": "2024-04-11T10:30:00Z"
}
```

---

## 🚫 HTTP Status Codes

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Authenticated but not authorized |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource conflict (e.g., duplicate email) |
| 413 | Payload Too Large | File or request too large |
| 422 | Unprocessable Entity | Validation error |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |
| 503 | Service Unavailable | Server temporarily unavailable |

---

## 🔒 Authentication & Security

### Token Structure
All authenticated requests require a JWT token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Claims
```json
{
  "userId": "USR_12345",
  "username": "john_doe",
  "email": "john@email.com",
  "iat": 1712829000,
  "exp": 1712832600
}
```

### Security Headers
Headers that should be included in all requests:
- `Content-Type: application/json` or `application/x-www-form-urlencoded`
- `Authorization: Bearer {token}`
- `X-Client-Version: 0.1.0` (optional)

---

## ⚙️ API Rate Limiting

To prevent abuse, the API implements rate limiting:

- **General Endpoints**: 100 requests per 15 minutes per user
- **Authentication Endpoints**: 5 requests per minute per IP
- **File Upload Endpoints**: 10 requests per hour per user

Rate limit headers in response:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1712832600
```

---

## 📤 File Upload Guidelines

### Supported File Formats

**Video Files:**
- MP4 (.mp4)
- AVI (.avi)
- MOV (.mov)
- WebM (.webm)

**Audio Files:**
- MP3 (.mp3)
- WAV (.wav)
- OGG (.ogg)
- M4A (.m4a)

### File Size Limits

- Video: Max 500 MB
- Audio: Max 100 MB
- Images: Max 10 MB

---

## 🔗 CORS Configuration

The frontend should be configured to accept requests from:

```
Access-Control-Allow-Origin: http://localhost:3000, https://eveda.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

---

## 📝 API Request Examples

### Using Fetch API
```javascript
// Login Request
const loginRequest = async (username, password) => {
  const response = await fetch('http://localhost:8080/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  });
  return response.json();
};

// Get Dashboard Data
const getDashboardData = async (token) => {
  const response = await fetch('http://localhost:8080/api/dashboard/overview', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
};
```

### Using Axios
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api'
});

// Add token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Login
const login = (username, password) => 
  api.post('/auth/login', { username, password });

// Get Dashboard
const getDashboard = () => 
  api.get('/dashboard/overview');
```

---

## 🔄 Webhook Events

The API sends webhooks for important events:

### Report Analysis Completed
```json
{
  "event": "report.analysis_completed",
  "data": {
    "reportId": "RPT_12345",
    "userId": "USR_12345",
    "status": "Completed",
    "timestamp": "2024-04-11T10:35:00Z"
  }
}
```

### Consultation Reminder
```json
{
  "event": "consultation.reminder",
  "data": {
    "consultationId": "CON_12345",
    "doctorName": "Dr. Smith",
    "appointmentDate": "2024-04-12T14:00:00Z",
    "timeUntilAppointment": "24 hours"
  }
}
```

---

## 🆘 Error Handling

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| INVALID_CREDENTIALS | 401 | Username/password incorrect |
| EMAIL_EXISTS | 409 | Email already registered |
| TOKEN_EXPIRED | 401 | JWT token has expired |
| INSUFFICIENT_PERMISSIONS | 403 | User lacks required permissions |
| RESOURCE_NOT_FOUND | 404 | Requested resource doesn't exist |
| VALIDATION_ERROR | 400 | Request validation failed |
| FILE_SIZE_EXCEEDED | 413 | Uploaded file too large |
| RATE_LIMIT_EXCEEDED | 429 | Too many requests |

---

## 📚 API Documentation Updates

**Last Updated:** April 11, 2024  
**API Version:** 1.0.0  
**Frontend Version:** 0.1.0  

For questions or issues, contact: support@eveda.com

---

## 📖 Additional Resources

- [Frontend Repo Structure](Frontend/)
- [React Documentation](https://react.dev)
- [React Router Documentation](https://reactrouter.com)
- [JWT Authentication Guide](https://jwt.io)


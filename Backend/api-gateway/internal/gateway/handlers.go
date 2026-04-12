package gateway

import (
	"context"
	"e_veda/proto/iampb"
	"e_veda/proto/userpb"
	"encoding/json"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"path/filepath"
	_ "strconv"
	"time"

	"google.golang.org/grpc/status" // Required to unpack gRPC errors
)

// ==========================================
// Struct Definitions
// ==========================================

type LoginPayload struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type SignupPayload struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type ForgotPasswordPayload struct {
	Email string `json:"email"`
}

type VerifyOtpPayload struct {
	Email string `json:"email"`
	Otp   string `json:"otp"`
}

type ResetPasswordPayload struct {
	Token         string `json:"token"`
	ResetPassword string `json:"reset_password"`
}

type ProfileUpdatePayload struct {
	Name     string `json:"name"`
	Nickname string `json:"nickname"`
	Age      int64  `json:"age"`
}

// ==========================================
// JSON Error Helpers
// ==========================================

// respondWithError sends a standard JSON formatted error
func respondWithError(w http.ResponseWriter, statusCode int, errorType string, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"error":   errorType,
		"status":  statusCode,
		"message": message,
	})
}

// respondWithGrpcError extracts the clean message from a gRPC error and formats it as JSON
func respondWithGrpcError(w http.ResponseWriter, statusCode int, errorType string, err error) {
	message := err.Error()
	if st, ok := status.FromError(err); ok {
		message = st.Message() // Extract the clean message without the gRPC wrapper
	}
	respondWithError(w, statusCode, errorType, message)
}

// ==========================================
// Handlers
// ==========================================

func (h *Handler) Login(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		respondWithError(w, http.StatusMethodNotAllowed, "Method Not Allowed", "Method must be POST")
		return
	}

	var payload LoginPayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		respondWithError(w, http.StatusBadRequest, "Bad Request", "Invalid JSON request")
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), time.Second*10)
	defer cancel()

	// Forward Credentials to IAM service
	res, err := h.iamClient.Login(ctx, &iampb.LoginRequest{
		Email:    payload.Email,
		Password: payload.Password,
	})
	if err != nil {
		respondWithGrpcError(w, http.StatusUnauthorized, "Unauthorized", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(map[string]interface{}{
		"status":  "success",
		"message": "Login successful",
		"data": map[string]interface{}{
			"userId":       res.UserId,
			"username":     res.Username,
			"email":        res.Email,
			"fullName":     res.FullName,
			"token":        res.Token,
			"refreshToken": res.RefreshToken,
			"expiresIn":    res.ExpiresIn,
		},
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Internal Server Error", err.Error())
	}
}

func (h *Handler) GetUserProfile(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		respondWithError(w, http.StatusMethodNotAllowed, "Method Not Allowed", "Method must be GET")
		return
	}

	userUUID, ok := r.Context().Value(userUUIDKey).(string)
	if !ok {
		respondWithError(w, http.StatusUnauthorized, "Unauthorized", "User UUID not found in request context")
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), time.Second*10)
	defer cancel()

	// 1. Fetch data from User Service
	userRes, err := h.userClient.GetUser(ctx, &userpb.GetUserRequest{
		UserId: userUUID,
	})
	if err != nil {
		respondWithGrpcError(w, http.StatusNotFound, "Not Found", err)
		return
	}

	// 2. Fetch data from IAM Service
	iamRes, err := h.iamClient.GetUserInfo(ctx, &iampb.GetUserInfoRequest{
		UserId: userUUID,
	})
	if err != nil {
		log.Printf("Warning: Failed to fetch IAM info for user %s: %v", userUUID, err)
		// We still return user profile even if IAM info fails
	}

	var email, username, lastLogin string
	if iamRes != nil {
		email = iamRes.Email
		username = iamRes.Username
		lastLogin = iamRes.LastLogin
	}

	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(map[string]interface{}{
		"status":  "success",
		"message": "Profile retrieved successfully",
		"data": map[string]interface{}{
			"userId":           userUUID,
			"username":         username,
			"email":            email,
			"fullName":         userRes.FullName,
			"nickname":         userRes.Nickname,
			"age":              userRes.Age,
			"dateOfBirth":      userRes.DateOfBirth,
			"gender":           userRes.Gender,
			"phoneNumber":      userRes.PhoneNumber,
			"address":          userRes.Address,
			"medicalHistory":   json.RawMessage(userRes.MedicalHistory),
			"emergencyContact": json.RawMessage(userRes.EmergencyContact),
			"profilePicture":   userRes.ProfilePicture,
			"createdAt":        userRes.CreatedAt,
			"lastLogin":        lastLogin,
		},
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Internal Server Error", err.Error())
	}
}

func (h *Handler) Signup(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		respondWithError(w, http.StatusMethodNotAllowed, "Method Not Allowed", "Method must be POST")
		return
	}

	var payload SignupPayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		respondWithError(w, http.StatusBadRequest, "Bad Request", "Invalid JSON request")
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), time.Second*10)
	defer cancel()

	iamRes, err := h.iamClient.SignUp(ctx, &iampb.SignUpRequest{
		Email:    payload.Email,
		Password: payload.Password,
	})
	if err != nil {
		respondWithGrpcError(w, http.StatusConflict, "Conflict", err)
		return
	}

	_, err = h.userClient.CreateUser(ctx, &userpb.CreateUserRequest{
		UserId: iamRes.GetUserUuid(),
		Name:   payload.Name,
	})

	if err != nil {
		log.Printf("User Service failed, rolling back IAM for %s", payload.Email)
		_, _ = h.iamClient.DeleteUser(ctx, &iampb.DeleteUserRequest{UserUuid: iamRes.GetUserUuid()})
		respondWithError(w, http.StatusInternalServerError, "Internal Server Error", "Failed to create account. Please try again.")
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	err = json.NewEncoder(w).Encode(map[string]interface{}{
		"status":  "success",
		"message": "Account created successfully",
		"data": map[string]interface{}{
			"userId":       iamRes.UserUuid,
			"username":     payload.Email, // Simplified
			"email":        payload.Email,
			"token":        iamRes.Token,
			"refreshToken": iamRes.RefreshToken,
			"expiresIn":    iamRes.ExpiresIn,
		},
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Internal Server Error", err.Error())
	}
}

func (h *Handler) ForgotPassword(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		respondWithError(w, http.StatusMethodNotAllowed, "Method Not Allowed", "Method must be POST")
		return
	}

	var payload ForgotPasswordPayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		respondWithError(w, http.StatusBadRequest, "Bad Request", "Invalid JSON request")
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), time.Second*10)
	defer cancel()

	res, err := h.iamClient.ForgotPassword(ctx, &iampb.ForgotPasswordRequest{
		Email: payload.Email,
	})
	if err != nil {
		respondWithGrpcError(w, http.StatusNotFound, "Not Found", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(map[string]interface{}{
		"status":  "success",
		"message": "Reset link sent to your email",
		"data": map[string]string{
			"message": res.Message,
		},
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Internal Server Error", err.Error())
	}
}

func (h *Handler) VerifyOtp(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		respondWithError(w, http.StatusMethodNotAllowed, "Method Not Allowed", "Method must be POST")
		return
	}

	var payload VerifyOtpPayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		respondWithError(w, http.StatusBadRequest, "Bad Request", "Invalid JSON request")
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), time.Second*10)
	defer cancel()

	res, err := h.iamClient.VerifyOtp(ctx, &iampb.VerifyOtpRequest{
		Email: payload.Email,
		Otp:   payload.Otp,
	})
	if err != nil {
		respondWithGrpcError(w, http.StatusUnauthorized, "Unauthorized", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(map[string]string{
		"reset_token": res.ResetToken,
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Internal Server Error", err.Error())
	}
}

func (h *Handler) ResetPassword(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		respondWithError(w, http.StatusMethodNotAllowed, "Method Not Allowed", "Method must be POST")
		return
	}

	var payload ResetPasswordPayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		respondWithError(w, http.StatusBadRequest, "Bad Request", "Invalid JSON request")
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), time.Second*10)
	defer cancel()

	_, err := h.iamClient.ResetPassword(ctx, &iampb.ResetPasswordRequest{
		ResetToken:  payload.Token,
		NewPassword: payload.ResetPassword,
	})
	if err != nil {
		respondWithGrpcError(w, http.StatusUnauthorized, "Unauthorized", err)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(map[string]interface{}{
		"status":  "success",
		"message": "Password reset successfully",
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Internal Server Error", err.Error())
	}
}

func (h *Handler) Logout(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		respondWithError(w, http.StatusMethodNotAllowed, "Method Not Allowed", "Method must be POST")
		return
	}

	token := r.Header.Get("Authorization")
	if len(token) > 7 && token[:7] == "Bearer " {
		token = token[7:]
	} else {
		respondWithError(w, http.StatusUnauthorized, "Unauthorized", "Missing or invalid Authorization header")
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), time.Second*10)
	defer cancel()

	_, err := h.iamClient.Logout(ctx, &iampb.LogoutRequest{Token: token})
	if err != nil {
		respondWithGrpcError(w, http.StatusUnauthorized, "Unauthorized", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":  "success",
		"message": "Logged out successfully",
	})
}

func (h *Handler) RefreshToken(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		respondWithError(w, http.StatusMethodNotAllowed, "Method Not Allowed", "Method must be POST")
		return
	}

	var payload struct {
		RefreshToken string `json:"refreshToken"`
	}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		respondWithError(w, http.StatusBadRequest, "Bad Request", "Invalid JSON request")
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), time.Second*10)
	defer cancel()

	res, err := h.iamClient.RefreshToken(ctx, &iampb.RefreshTokenRequest{RefreshToken: payload.RefreshToken})
	if err != nil {
		respondWithGrpcError(w, http.StatusUnauthorized, "Unauthorized", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":  "success",
		"message": "Token refreshed",
		"data": map[string]interface{}{
			"token":        res.Token,
			"refreshToken": res.RefreshToken,
			"expiresIn":    res.ExpiresIn,
		},
	})
}

func (h *Handler) UpdateUserProfile(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		respondWithError(w, http.StatusMethodNotAllowed, "Method Not Allowed", "Method must be PUT")
		return
	}

	userUUID, ok := r.Context().Value(userUUIDKey).(string)
	if !ok {
		respondWithError(w, http.StatusUnauthorized, "Unauthorized", "User UUID not found in request context")
		return
	}

	var payload struct {
		FullName         string      `json:"fullName"`
		Nickname         string      `json:"nickname"`
		Age              int64       `json:"age"`
		PhoneNumber      string      `json:"phoneNumber"`
		Address          string      `json:"address"`
		Gender           string      `json:"gender"`
		DateOfBirth      string      `json:"dateOfBirth"`
		MedicalHistory   interface{} `json:"medicalHistory"`
		EmergencyContact interface{} `json:"emergencyContact"`
	}

	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		respondWithError(w, http.StatusBadRequest, "Bad Request", "Invalid JSON request")
		return
	}

	medicalHistoryJson, _ := json.Marshal(payload.MedicalHistory)
	emergencyContactJson, _ := json.Marshal(payload.EmergencyContact)

	ctx, cancel := context.WithTimeout(r.Context(), time.Second*10)
	defer cancel()

	// Call the User Service gRPC method
	res, err := h.userClient.UpdateUser(ctx, &userpb.ProfileUpdateRequest{
		UserId:           userUUID,
		FullName:         payload.FullName,
		Nickname:         payload.Nickname,
		Age:              payload.Age,
		DateOfBirth:      payload.DateOfBirth,
		Gender:           payload.Gender,
		PhoneNumber:      payload.PhoneNumber,
		Address:          payload.Address,
		MedicalHistory:   string(medicalHistoryJson),
		EmergencyContact: string(emergencyContactJson),
	})
	if err != nil {
		respondWithGrpcError(w, http.StatusInternalServerError, "Internal Server Error", err)
		return
	}

	// Fetch updated data from IAM for complete response
	iamRes, _ := h.iamClient.GetUserInfo(ctx, &iampb.GetUserInfoRequest{UserId: userUUID})

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":  "success",
		"message": res.Message,
		"data": map[string]interface{}{
			"userId":      userUUID,
			"username":    iamRes.GetUsername(),
			"email":       iamRes.GetEmail(),
			"fullName":    payload.FullName,
			"phoneNumber": payload.PhoneNumber,
			"address":     payload.Address,
			"updatedAt":   time.Now().Format(time.RFC3339),
		},
	})
}

func (h *Handler) ChangePassword(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		respondWithError(w, http.StatusMethodNotAllowed, "Method Not Allowed", "Method must be POST")
		return
	}

	userUUID, ok := r.Context().Value(userUUIDKey).(string)
	if !ok {
		respondWithError(w, http.StatusUnauthorized, "Unauthorized", "User UUID not found in request context")
		return
	}

	var payload struct {
		CurrentPassword string `json:"currentPassword"`
		NewPassword     string `json:"newPassword"`
		ConfirmPassword string `json:"confirmPassword"`
	}

	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		respondWithError(w, http.StatusBadRequest, "Bad Request", "Invalid JSON request")
		return
	}

	if payload.NewPassword != payload.ConfirmPassword {
		respondWithError(w, http.StatusBadRequest, "Bad Request", "New passwords do not match")
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), time.Second*10)
	defer cancel()

	_, err := h.iamClient.ChangePassword(ctx, &iampb.ChangePasswordRequest{
		UserId:          userUUID,
		CurrentPassword: payload.CurrentPassword,
		NewPassword:     payload.NewPassword,
	})
	if err != nil {
		respondWithGrpcError(w, http.StatusBadRequest, "Bad Request", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":  "success",
		"message": "Password changed successfully",
	})
}

func (h *Handler) UploadProfilePicture(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		respondWithError(w, http.StatusMethodNotAllowed, "Method Not Allowed", "Method must be POST")
		return
	}

	userUUID, ok := r.Context().Value(userUUIDKey).(string)
	if !ok {
		respondWithError(w, http.StatusUnauthorized, "Unauthorized", "Unauthorized request")
		return
	}

	// Parse multipart form, max 5MB
	err := r.ParseMultipartForm(5 << 20)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "Bad Request", "File is too large or invalid")
		return
	}

	file, header, err := r.FormFile("profile_picture")
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "Bad Request", "Could not get uploaded file")
		return
	}
	defer func(file multipart.File) {
		err := file.Close()
		if err != nil {
			log.Printf("Error closing file for upload: %v", err)
		}
	}(file)

	// Read file to bytes
	fileBytes, err := io.ReadAll(file)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Internal Server Error", "Could not read file")
		return
	}

	contentType := header.Header.Get("Content-Type")
	extension := filepath.Ext(header.Filename)

	ctx, cancel := context.WithTimeout(r.Context(), time.Second*10)
	defer cancel()

	// Call User Service via gRPC
	res, err := h.userClient.UploadProfilePicture(ctx, &userpb.UploadProfilePictureRequest{
		UserId:        userUUID,
		FileData:      fileBytes,
		ContentType:   contentType,
		FileExtension: extension,
	})
	if err != nil {
		respondWithGrpcError(w, http.StatusInternalServerError, "Internal Server Error", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(map[string]string{
		"message":   "Profile picture updated successfully",
		"image_url": res.Message,
	})
	if err != nil {
		log.Printf("Error encoding response: %v", err)
		respondWithError(w, http.StatusInternalServerError, "Internal Server Error", "Failed to encode response body")
	}
}

func (h *Handler) GetProfileCompletion(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		respondWithError(w, http.StatusMethodNotAllowed, "Method Not Allowed", "Method must be GET")
		return
	}

	// Extract the authenticated user's ID from the JWT middleware
	userUUID, ok := r.Context().Value(userUUIDKey).(string)
	if !ok {
		respondWithError(w, http.StatusUnauthorized, "Unauthorized", "User UUID not found in request context")
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), time.Second*10)
	defer cancel()

	// Call the User Service
	res, err := h.userClient.GetProfileCompleteness(ctx, &userpb.GetUserRequest{
		UserId: userUUID,
	})
	if err != nil {
		respondWithGrpcError(w, http.StatusInternalServerError, "Internal Server Error", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(map[string]interface{}{
		"isComplete":            res.IsCompleted,
		"completion_percentage": res.PercentageCompleted,
		"user_name":             res.Name,
	})

	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Internal Server Error", err.Error())
	}
}

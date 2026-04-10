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
	Name     string  `json:"name"`
	Nickname string  `json:"nickname"`
	Age      int64   `json:"age"`
	Height   int64   `json:"height"`
	Weight   float64 `json:"weight"`
	Gender   string  `json:"gender"`
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
	err = json.NewEncoder(w).Encode(map[string]string{
		"token": res.Token,
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

	res, err := h.userClient.GetUser(ctx, &userpb.GetUserRequest{
		UserId: userUUID,
	})
	if err != nil {
		respondWithGrpcError(w, http.StatusNotFound, "Not Found", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(map[string]interface{}{
		"name":            res.Name,
		"nickname":        res.Nickname,
		"age":             res.Age,
		"profile_picture": res.ProfilePicture,
		"height":          res.Height,
		"weight":          res.Weight,
		"gender":          res.Gender,
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

	// THE FIX: Compensating Transaction (Rollback)
	if err != nil {
		log.Printf("User Service failed, rolling back IAM for %s", payload.Email)

		// Tell IAM to delete the user we just created
		_, rollbackErr := h.iamClient.DeleteUser(ctx, &iampb.DeleteUserRequest{
			UserUuid: iamRes.GetUserUuid(),
		})

		if rollbackErr != nil {
			log.Printf("CRITICAL ALERT: Rollback failed for %s. Manual intervention required. Err: %v", iamRes.GetUserUuid(), rollbackErr)
		}

		// Return a clean error to the client so they can try again
		respondWithError(w, http.StatusInternalServerError, "Internal Server Error", "Failed to create account. Please try again.")
		return
	}

	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(map[string]string{
		"message":   "User created Successfully",
		"user_uuid": iamRes.GetUserUuid(),
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
	err = json.NewEncoder(w).Encode(map[string]string{
		"message": res.Message,
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

	res, err := h.iamClient.ResetPassword(ctx, &iampb.ResetPasswordRequest{
		ResetToken:  payload.Token,
		NewPassword: payload.ResetPassword,
	})
	if err != nil {
		respondWithGrpcError(w, http.StatusUnauthorized, "Unauthorized", err)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(map[string]string{
		"message": res.Message,
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Internal Server Error", err.Error())
	}
}

func (h *Handler) UpdateUserProfile(w http.ResponseWriter, r *http.Request) {
	// Standard REST convention is to use PUT or PATCH for updates
	if r.Method != http.MethodPut {
		respondWithError(w, http.StatusMethodNotAllowed, "Method Not Allowed", "Method must be PUT")
		return
	}

	// Extract the authenticated user's ID from the JWT middleware
	userUUID, ok := r.Context().Value(userUUIDKey).(string)
	if !ok {
		respondWithError(w, http.StatusUnauthorized, "Unauthorized", "User UUID not found in request context")
		return
	}

	// Parse the JSON request body
	var payload ProfileUpdatePayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		respondWithError(w, http.StatusBadRequest, "Bad Request", "Invalid JSON request")
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), time.Second*10)
	defer cancel()

	// Call the User Service gRPC method
	res, err := h.userClient.UpdateUser(ctx, &userpb.ProfileUpdateRequest{
		UserId:   userUUID,
		Name:     payload.Name,
		Nickname: payload.Nickname,
		Age:      payload.Age,
		Height:   payload.Height,
		Weight:   payload.Weight,
		Gender:   payload.Gender,
	})
	if err != nil {
		respondWithGrpcError(w, http.StatusInternalServerError, "Internal Server Error", err)
		return
	}

	// Return success response
	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(map[string]string{
		"message": res.Message,
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Internal Server Error", err.Error())
	}
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

func (h *Handler) GetPictureWithName(w http.ResponseWriter, r *http.Request) {
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
	res, err := h.userClient.GetPictureAndName(ctx, &userpb.GetUserRequest{
		UserId: userUUID,
	})
	if err != nil {
		respondWithGrpcError(w, http.StatusInternalServerError, "Internal Server Error", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(map[string]interface{}{
		"user_name":           res.Name,
		"profile_picture_url": res.ProfilePicture,
	})

	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Internal Server Error", err.Error())
	}
}

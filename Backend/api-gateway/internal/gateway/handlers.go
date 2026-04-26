package gateway

import (
	"context"
	"e_veda/proto/iampb"
	"e_veda/proto/userpb"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"net/url"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"google.golang.org/grpc/status" // Required to unpack gRPC errors
	"google.golang.org/protobuf/encoding/protojson"
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

type UpdatePasswordPayload struct {
	OldPassword string `json:"old_password"`
	NewPassword string `json:"new_password"`
}

type CreateReportPayload struct {
	AudioUrl string `json:"audio_url"`
	VideoUrl string `json:"video_url"`
}

// ==========================================
// JSON Error Helpers
// ==========================================

// respondWithError sends a standard JSON formatted error
func respondWithError(w http.ResponseWriter, statusCode int, errorType string, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	err := json.NewEncoder(w).Encode(map[string]interface{}{
		"error":   errorType,
		"status":  statusCode,
		"message": message,
	})
	if err != nil {
		log.Printf("Error Encoding message")
		return
	}
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
func (h *Handler) UpdatePassword(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		respondWithError(w, http.StatusMethodNotAllowed, "Method Not Allowed", "Method must be POST")
		return
	}

	// Extract the authenticated user's ID from the JWT middleware
	userUUID, ok := r.Context().Value(userUUIDKey).(string)
	if !ok {
		respondWithError(w, http.StatusUnauthorized, "Unauthorized", "User UUID not found in request context")
		return
	}

	var payload UpdatePasswordPayload
	ctx, cancel := context.WithTimeout(r.Context(), time.Second*10)
	defer cancel()

	// Call the User Service
	res, err := h.iamClient.UpdatePassword(ctx, &iampb.ChangePasswordRequest{
		OldPassword: payload.OldPassword,
		NewPassword: payload.NewPassword,
		UserUuid:    userUUID,
	})
	if err != nil {
		respondWithGrpcError(w, http.StatusInternalServerError, "Internal Server Error", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(map[string]interface{}{
		"message": res.Message,
	})

	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Internal Server Error", err.Error())
	}
}

func (h *Handler) GetGlobalEmotionalTrends(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		respondWithError(w, http.StatusMethodNotAllowed, "Method Not Allowed", "Method must be GET")
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), time.Second*15) // Given 15s since AI generation takes a moment
	defer cancel()

	// Call the User Service
	res, err := h.userClient.GetGlobalEmotionalTrends(ctx, &userpb.GetGlobalTrendsRequest{})
	if err != nil {
		respondWithGrpcError(w, http.StatusInternalServerError, "Internal Server Error", err)
		return
	}

	// Return the formatted array to the frontend
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(res.Trends); err != nil {
		respondWithError(w, http.StatusInternalServerError, "Internal Server Error", "Failed to encode response")
	}
}

func (h *Handler) GetDailyInsight(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		respondWithError(w, http.StatusMethodNotAllowed, "Method Not Allowed", "Method must be GET")
		return
	}

	userUUID, ok := r.Context().Value(userUUIDKey).(string)
	if !ok {
		respondWithError(w, http.StatusUnauthorized, "Unauthorized", "User UUID not found")
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), time.Second*10)
	defer cancel()

	res, err := h.userClient.GetDailyInsight(ctx, &userpb.GetUserRequest{
		UserId: userUUID,
	})
	if err != nil {
		respondWithGrpcError(w, http.StatusInternalServerError, "Internal Server Error", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	// Return it wrapped in a clean JSON object for the UI
	err = json.NewEncoder(w).Encode(map[string]string{
		"insight": res.Insight,
		"details": res.Details,
	})

	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Internal Server Error", "Failed to encode response")
	}
}

func (h *Handler) UploadAudio(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		respondWithError(w, http.StatusMethodNotAllowed, "Method Not Allowed", "Method must be POST")
		return
	}

	userUUID, ok := r.Context().Value(userUUIDKey).(string)
	if !ok {
		respondWithError(w, http.StatusUnauthorized, "Unauthorized", "User UUID not found")
		return
	}

	// Parse the audio file (Allowing up to 50MB)
	fileBytes, contentType, extension, err := parseFileUpload(r, 50<<20)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "Bad Request", err.Error())
		return
	}

	// Give the upload a slightly longer timeout since media files are large
	ctx, cancel := context.WithTimeout(r.Context(), time.Second*30)
	defer cancel()

	res, err := h.userClient.UploadAudio(ctx, &userpb.UploadProfilePictureRequest{
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
		"message": res.Message, // This contains the MinIO Audio URL
	})
	if err != nil {
		return
	}
}

func (h *Handler) UploadVideo(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		respondWithError(w, http.StatusMethodNotAllowed, "Method Not Allowed", "Method must be POST")
		return
	}

	userUUID, ok := r.Context().Value(userUUIDKey).(string)
	if !ok {
		respondWithError(w, http.StatusUnauthorized, "Unauthorized", "User UUID not found")
		return
	}

	// Parse the video file (Allowing up to 200MB)
	fileBytes, contentType, extension, err := parseFileUpload(r, 200<<20)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "Bad Request", err.Error())
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), time.Minute*1) // 1 minute timeout for video
	defer cancel()

	res, err := h.userClient.UploadVideo(ctx, &userpb.UploadProfilePictureRequest{
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
		"message": res.Message, // This contains the MinIO Video URL
	})
	if err != nil {
		return
	}
}

func parseFileUpload(r *http.Request, maxMemory int64) ([]byte, string, string, error) {
	if err := r.ParseMultipartForm(maxMemory); err != nil {
		return nil, "", "", fmt.Errorf("file is too large or invalid")
	}

	// We assume the frontend appends the file to a form field named "file"
	file, header, err := r.FormFile("file")
	if err != nil {
		return nil, "", "", fmt.Errorf("could not get uploaded file")
	}
	defer func(file multipart.File) {
		err := file.Close()
		if err != nil {
			log.Printf("could not close uploaded file: %v", err)
			return
		}
	}(file)

	fileBytes, err := io.ReadAll(file)
	if err != nil {
		return nil, "", "", fmt.Errorf("could not read file bytes")
	}

	contentType := header.Header.Get("Content-Type")
	extension := filepath.Ext(header.Filename)

	return fileBytes, contentType, extension, nil
}

func (h *Handler) CreateReport(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		respondWithError(w, http.StatusMethodNotAllowed, "Method Not Allowed", "Method must be POST")
		return
	}

	userUUID, ok := r.Context().Value(userUUIDKey).(string)
	if !ok {
		respondWithError(w, http.StatusUnauthorized, "Unauthorized", "User UUID not found")
		return
	}

	var payload CreateReportPayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		respondWithError(w, http.StatusBadRequest, "Bad Request", "Invalid JSON request")
		return
	}

	// FIX 1: Scrub the inputs for invalid UTF-8 before passing them to gRPC.
	// This prevents dirty URLs from crashing the gRPC transport layer.
	cleanAudioUrl := strings.ToValidUTF8(payload.AudioUrl, "")
	cleanVideoUrl := strings.ToValidUTF8(payload.VideoUrl, "")

	ctx, cancel := context.WithTimeout(r.Context(), time.Second*20)
	defer cancel()

	res, err := h.userClient.CreateNewReport(ctx, &userpb.CreateNewReportRequest{
		UserId:   userUUID,
		AudioUrl: cleanAudioUrl,
		VideoUrl: cleanVideoUrl,
	})

	if err != nil {
		// If it still fails here, the AI server sent back bad UTF-8.
		log.Printf("gRPC CreateNewReport failed: %v", err)
		respondWithGrpcError(w, http.StatusInternalServerError, "Internal Server Error", err)
		return
	}

	// FIX 2: Use protojson to format the gRPC response into standard JSON.
	// This strips out internal proto fields and respects your snake_case proto tags.
	marshaller := protojson.MarshalOptions{
		UseProtoNames:   true, // Forces snake_case keys as defined in your .proto file
		EmitUnpopulated: true, // Includes fields even if they are empty/null
	}

	jsonBytes, err := marshaller.Marshal(res)
	if err != nil {
		log.Printf("could not encode proto to JSON: %v", err)
		respondWithError(w, http.StatusInternalServerError, "Internal Server Error", "Failed to parse report data")
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	_, err = w.Write(jsonBytes)
	if err != nil {
		return
	}
}

func (h *Handler) GetReportsList(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		respondWithError(w, http.StatusMethodNotAllowed, "Method Not Allowed", "Method must be GET")
		return
	}

	userUUID, ok := r.Context().Value(userUUIDKey).(string)
	if !ok {
		respondWithError(w, http.StatusUnauthorized, "Unauthorized", "User UUID not found")
		return
	}

	// Parse Query Parameters
	pageStr := r.URL.Query().Get("page")
	limitStr := r.URL.Query().Get("limit")
	searchQuery := r.URL.Query().Get("search")

	page, _ := strconv.Atoi(pageStr)   // Defaults to 0 if empty
	limit, _ := strconv.Atoi(limitStr) // Defaults to 0 if empty

	ctx, cancel := context.WithTimeout(r.Context(), time.Second*10)
	defer cancel()

	res, err := h.userClient.GetReportsList(ctx, &userpb.GetReportsListRequest{
		UserId:      userUUID,
		Page:        int32(page),
		Limit:       int32(limit),
		SearchQuery: searchQuery,
	})

	if err != nil {
		respondWithGrpcError(w, http.StatusInternalServerError, "Internal Server Error", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	// Return the exact structure the pagination UI needs
	err = json.NewEncoder(w).Encode(map[string]interface{}{
		"data": res.Reports,
		"pagination": map[string]interface{}{
			"total_count":  res.TotalCount,
			"total_pages":  res.TotalPages,
			"current_page": res.CurrentPage,
		},
	})
	if err != nil {
		log.Printf("could not encode response: %v", err)
		return
	}
}

func (h *Handler) GetReportDraftInfo(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		respondWithError(w, http.StatusMethodNotAllowed, "Method Not Allowed", "Method must be GET")
		return
	}

	userUUID, ok := r.Context().Value(userUUIDKey).(string)
	if !ok {
		respondWithError(w, http.StatusUnauthorized, "Unauthorized", "User UUID not found")
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), time.Second*5) // Quick database hit
	defer cancel()

	res, err := h.userClient.GetReportDraftInfo(ctx, &userpb.GetUserRequest{
		UserId: userUUID,
	})
	if err != nil {
		respondWithGrpcError(w, http.StatusInternalServerError, "Internal Server Error", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(map[string]string{
		"patient_name":      res.PatientName,
		"projected_next_id": res.ProjectedNextId,
	})
	if err != nil {
		log.Printf("failed to encode json: %v", err)
		return
	}
}

func (h *Handler) GetReportById(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		respondWithError(w, http.StatusMethodNotAllowed, "Method Not Allowed", "Method must be GET")
		return
	}

	_, ok := r.Context().Value(userUUIDKey).(string)
	if !ok {
		respondWithError(w, http.StatusUnauthorized, "Unauthorized", "User UUID not found")
		return
	}

	rawReportID := r.URL.Query().Get("id")

	if rawReportID == "" {
		respondWithError(w, http.StatusBadRequest, "Bad Request", "Report ID is required")
		return
	}

	// 2. FORCE URL DECODING
	// This turns "%23EV-00020" back into "#EV-00020"
	reportID, err := url.QueryUnescape(rawReportID)
	if err != nil {
		// Fallback just in case decoding fails, though it rarely does
		reportID = rawReportID
	}

	ctx, cancel := context.WithTimeout(r.Context(), time.Second*5) // Quick database hit
	defer cancel()

	// 2. Call the gRPC microservice
	res, err := h.userClient.GetReportByID(ctx, &userpb.GetReportByIdRequest{
		ReportId: reportID, // Pass the extracted ID here
	})
	if err != nil {
		if strings.Contains(err.Error(), "not found") {
			respondWithError(w, http.StatusNotFound, "Not Found", "Report not found")
			return
		}
		// Otherwise, it's a real 500 error
		respondWithGrpcError(w, http.StatusInternalServerError, "Internal Server Error", err)
		return
	}

	// 3. Format and send the response
	w.Header().Set("Content-Type", "application/json")

	responseMap := map[string]interface{}{
		"report_id":         res.ReportId,
		"patient_name":      res.PatientName,
		"analysis_result":   res.AnalysisResult.AsMap(),
		"confidence_result": res.ConfidenceResult,
		"accuracy_result":   res.AccuracyResult,
		"date":              res.Date,
		"time":              res.Time,
	}

	if err := json.NewEncoder(w).Encode(responseMap); err != nil {
		respondWithError(w, http.StatusInternalServerError, "Internal Server Error", "Failed to encode response")
		return
	}
}

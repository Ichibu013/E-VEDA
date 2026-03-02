package gateway

import (
	"context"
	"e_veda/proto/iampb"
	"e_veda/proto/userpb"
	"encoding/json"
	"net/http"
	"time"
)

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

func (h *Handler) Login(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed .. most be POST", http.StatusMethodNotAllowed)
		return
	}

	var payload LoginPayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "Invalid JSON request", http.StatusBadRequest)
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
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(map[string]string{
		"token": res.Token,
	})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func (h *Handler) GetUserProfile(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed .. most be GET", http.StatusMethodNotAllowed)
		return
	}

	userUUID, ok := r.Context().Value(userUUIDKey).(string)
	if !ok {
		http.Error(w, "User UUID not found in request context", http.StatusUnauthorized)
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), time.Second*10)
	defer cancel()

	res, err := h.userClient.GetUser(ctx, &userpb.GetUserRequest{
		UserId: userUUID,
	})
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(map[string]string{
		"id":    res.Id,
		"name":  res.Name,
		"email": res.Email,
	})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func (h *Handler) Signup(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed .. most be POST", http.StatusMethodNotAllowed)
		return
	}

	var payload SignupPayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "Invalid JSON request", http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), time.Second*10)
	defer cancel()

	iamRes, err := h.iamClient.SignUp(ctx, &iampb.SignUpRequest{
		Email:    payload.Email,
		Password: payload.Password,
	})
	if err != nil {
		http.Error(w, err.Error(), http.StatusConflict)
		return
	}

	_, err = h.userClient.CreateUser(ctx, &userpb.CreateUserRequest{
		UserId: iamRes.GetUserUuid(),
		Name:   payload.Name,
		Email:  payload.Email,
	})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(map[string]string{
		"message":   "User created Successfully",
		"user_uuid": iamRes.GetUserUuid(),
	})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func (h *Handler) ForgotPassword(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed .. most be POST", http.StatusMethodNotAllowed)
		return
	}

	var payload ForgotPasswordPayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "Invalid JSON request", http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), time.Second*10)
	defer cancel()

	res, err := h.iamClient.ForgotPassword(ctx, &iampb.ForgotPasswordRequest{
		Email: payload.Email,
	})
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(map[string]string{
		"message": res.Message,
	})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func (h *Handler) VerifyOtp(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed .. most be POST", http.StatusMethodNotAllowed)
		return
	}

	var payload VerifyOtpPayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "Invalid JSON request", http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), time.Second*10)
	defer cancel()

	res, err := h.iamClient.VerifyOtp(ctx, &iampb.VerifyOtpRequest{
		Email: payload.Email,
		Otp:   payload.Otp,
	})
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(map[string]string{
		"reset_token": res.ResetToken,
	})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func (h *Handler) ResetPassword(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed .. most be POST", http.StatusMethodNotAllowed)
		return
	}

	var payload ResetPasswordPayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "Invalid JSON request", http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), time.Second*10)
	defer cancel()

	res, err := h.iamClient.ResetPassword(ctx, &iampb.ResetPasswordRequest{
		ResetToken:  payload.Token,
		NewPassword: payload.Token,
	})
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(map[string]string{
		"message": res.Message,
	})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

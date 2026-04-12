package gateway

import (
	"e_veda/proto/iampb"
	"e_veda/proto/userpb"
	"net/http"
)

type Handler struct {
	iamClient  iampb.IAMServiceClient
	userClient userpb.UserServiceClient
}

func NewRouter(iamClient iampb.IAMServiceClient, userClient userpb.UserServiceClient) http.Handler {
	h := &Handler{iamClient: iamClient, userClient: userClient}

	mux := http.NewServeMux()

	mux.HandleFunc("/api/auth/login", h.Login)
	mux.HandleFunc("/api/auth/signup", h.Signup)
	mux.HandleFunc("/api/auth/logout", h.Logout)
	mux.HandleFunc("/api/auth/refresh-token", h.RefreshToken)
	mux.HandleFunc("/api/auth/forgot-password", h.ForgotPassword)
	mux.HandleFunc("/api/auth/verify-otp", h.VerifyOtp)
	mux.HandleFunc("/api/auth/reset-password", h.ResetPassword)

	// User Routes (Protected)
	mux.Handle("/api/users/profile-picture", h.AuthMiddleware(http.HandlerFunc(h.UploadProfilePicture)))
	mux.Handle("/api/users/completion", h.AuthMiddleware(http.HandlerFunc(h.GetProfileCompletion)))
	mux.Handle("/api/users/change-password", h.AuthMiddleware(http.HandlerFunc(h.ChangePassword)))

	mux.Handle("/api/users/profile", h.AuthMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			h.GetUserProfile(w, r)
		case http.MethodPut:
			h.UpdateUserProfile(w, r)
		default:
			respondWithError(w, http.StatusMethodNotAllowed, "Method Not Allowed", "Method must be GET or PUT")
		}
	})))

	return CorsMiddleware(mux)
}

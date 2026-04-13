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

	mux.HandleFunc("/api/login", h.Login)
	mux.HandleFunc("/api/signup", h.Signup)
	mux.HandleFunc("/api/forgot-password", h.ForgotPassword)
	mux.HandleFunc("/api/verify-otp", h.VerifyOtp)
	mux.HandleFunc("/api/reset-password", h.ResetPassword)

	// User Routes (Protected)
	mux.Handle("/api/user/profile-picture", h.AuthMiddleware(http.HandlerFunc(h.UploadProfilePicture)))
	mux.Handle("/api/user/completion", h.AuthMiddleware(http.HandlerFunc(h.GetProfileCompletion)))
	mux.Handle("/api/user/picture-name", h.AuthMiddleware(http.HandlerFunc(h.GetPictureWithName)))
	mux.Handle("/api/user/update-password", h.AuthMiddleware(http.HandlerFunc(h.UpdatePassword)))
	mux.Handle("/api/ai/global-trends", h.AuthMiddleware(http.HandlerFunc(h.GetGlobalEmotionalTrends)))
	mux.Handle("/api/ai/insight", h.AuthMiddleware(http.HandlerFunc(h.GetDailyInsight)))
	mux.Handle("/api/report/upload/audio", h.AuthMiddleware(http.HandlerFunc(h.UploadAudio)))
	mux.Handle("/api/report/upload/video", h.AuthMiddleware(http.HandlerFunc(h.UploadVideo)))
	mux.Handle("/api/report/create", h.AuthMiddleware(http.HandlerFunc(h.CreateReport)))
	mux.Handle("/api/reports", h.AuthMiddleware(http.HandlerFunc(h.GetReportsList)))
	mux.Handle("/api/report/draft-info", h.AuthMiddleware(http.HandlerFunc(h.GetReportDraftInfo)))

	mux.Handle("/api/user", h.AuthMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			h.GetUserProfile(w, r)
		case http.MethodPut:
			h.UpdateUserProfile(w, r) // Directs PUT requests to your new handler
		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})))

	return CorsMiddleware(mux)
}

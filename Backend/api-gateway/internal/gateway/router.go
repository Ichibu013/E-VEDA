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

func NewRouter(iamClient iampb.IAMServiceClient, userClient userpb.UserServiceClient) *http.ServeMux {
	h := &Handler{iamClient: iamClient, userClient: userClient}

	mux := http.NewServeMux()

	mux.HandleFunc("/api/login", h.Login)
	mux.HandleFunc("/api/signup", h.Signup)
	mux.HandleFunc("/api/forgot-password", h.ForgotPassword)
	mux.HandleFunc("/api/verify-otp", h.VerifyOtp)
	mux.HandleFunc("/api/reset-password", h.ResetPassword)

	mux.Handle("/api/user", h.AuthMiddleware(http.HandlerFunc(h.GetUserProfile)))

	return mux
}

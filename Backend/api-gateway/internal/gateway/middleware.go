package gateway

import (
	"context"
	"e_veda/proto/iampb"
	"net/http"
	"strings"
	"time"
)

type contextKey string

const userUUIDKey contextKey = "user_uuid"

func (h *Handler) AuthMiddleware(next http.Handler) http.Handler {
	// Middle ware  to intercept api calls to validate JWT token
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			http.Error(w, "Missing or Invalid Authorization header", http.StatusUnauthorized)
			return
		}

		token := strings.TrimPrefix(authHeader, "Bearer ")

		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		//Call IAM Service to validate Token
		res, err := h.iamClient.ValidateToken(ctx, &iampb.TokenRequest{Token: token})
		if err != nil || !res.GetIsValid() {
			http.Error(w, "Invalid or Expired token", http.StatusUnauthorized)
			return
		}

		// Token is valid, inject user_uuid into request_context
		ctxWithUser := context.WithValue(r.Context(), userUUIDKey, res.GetUserId())

		// Pass request to next handler
		next.ServeHTTP(w, r.WithContext(ctxWithUser))
	})
}

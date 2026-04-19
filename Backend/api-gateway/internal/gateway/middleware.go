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
	// Middleware to intercept API calls and validate JWT token
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			// FIXED: Replaced http.Error with clean JSON helper
			respondWithError(w, http.StatusUnauthorized, "Unauthorized", "Missing or Invalid Authorization header")
			return
		}

		token := strings.TrimPrefix(authHeader, "Bearer ")

		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		// Call IAM Service to validate Token
		res, err := h.iamClient.ValidateToken(ctx, &iampb.TokenRequest{Token: token})

		// 1. Check for gRPC or network errors
		if err != nil {
			respondWithGrpcError(w, http.StatusUnauthorized, "Unauthorized", err)
			return
		}

		// 2. Check if IAM service explicitly marked the token as invalid
		if !res.GetIsValid() {
			respondWithError(w, http.StatusUnauthorized, "Unauthorized", "Invalid or Expired token")
			return
		}

		// Token is valid, inject user_uuid into request context
		ctxWithUser := context.WithValue(r.Context(), userUUIDKey, res.GetUserId())

		// Pass request to next handler
		next.ServeHTTP(w, r.WithContext(ctxWithUser))
	})
}

// CorsMiddleware handles Cross-Origin Resource Sharing (CORS) headers
func CorsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")

		// Define your trusted origins
		allowedOrigins := map[string]bool{
			"http://localhost:5173":                            true,
			"https://truing-multidentate-julio.ngrok-free.dev": true,
		}

		// If the request origin is in our allowed list, set it dynamically
		if allowedOrigins[origin] {
			w.Header().Set("Access-Control-Allow-Origin", origin)
		}

		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}

# Stage 1: Build
FROM golang:1.26-alpine AS builder
LABEL authors="Ansh Sharma"

WORKDIR /workspace

# 1. Copy the entire monorepo
# (This is fast and safe because your .dockerignore excludes junk)
COPY . .

WORKDIR /workspace/iam-service

# 3. THE PRO APPROACH: BuildKit Cache Mounts
# - target=/go/pkg/mod caches the downloaded libraries
# - target=/root/.cache/go-build caches the compiled Go objects
# This means even if you change your source code, the build takes milliseconds!
RUN --mount=type=cache,target=/go/pkg/mod \
    --mount=type=cache,target=/root/.cache/go-build \
    CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o /app/bin/server ./cmd/server
# ==========================================
# Stage 2: Minimal Runtime
# ==========================================
FROM alpine:latest

# Add standard root certificates for secure connections
RUN apk --no-cache add ca-certificates tzdata

WORKDIR /app

# Copy the static binary from the builder stage
COPY --from=builder /app/bin/server .

EXPOSE 50052
CMD ["./server"]
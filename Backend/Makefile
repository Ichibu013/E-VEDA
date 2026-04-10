# ==============================================================================
# Enterprise Microservices Makefile
# ==============================================================================

# Variables
COMPOSE_FILE=docker-compose.yml

# Default target executed when no arguments are given to make.
.DEFAULT_GOAL := help

# ==============================================================================
# Docker Compose Commands
# ==============================================================================

.PHONY: up
up: ## Start the entire microservice stack in the background
	@echo "Starting the microservices cluster..."
	docker compose -f $(COMPOSE_FILE) up -d --build

.PHONY: down
down: ## Stop and remove all containers, networks, and volumes
	@echo "Shutting down the cluster..."
	docker compose -f $(COMPOSE_FILE) down

.PHONY: build
build: ## Rebuild all Docker images using BuildKit cache mounts
	@echo "Building optimized Docker images..."
	docker compose -f $(COMPOSE_FILE) build

.PHONY: logs
logs: ## Tail the logs for all services in real-time
	docker compose -f $(COMPOSE_FILE) logs -f

.PHONY: restart
restart: down up ## Completely restart the cluster

.PHONY: clean
clean: down ## Stop services and prune all unused Docker data (Use with caution)
	@echo "Cleaning up dangling Docker resources..."
	docker system prune -f

# ==============================================================================
# Go Workspace & Development Commands
# ==============================================================================

.PHONY: proto
proto: ## Compile the gRPC Protocol Buffer contracts
	@echo "Generating Go code from Protobuf definitions..."
	cd proto && PATH="$$PATH:$$(go env GOPATH)/bin" && protoc --go_out=paths=source_relative:. --go-grpc_out=paths=source_relative:. iampb/iam.proto userpb/user.proto
	@echo "Protobuf compilation complete."

.PHONY: tidy
tidy: ## Sync the Go workspace and tidy all module dependencies
	@echo "Tidying module dependencies..."
	go work sync
	cd api-gateway && go mod tidy
	cd iam-service && go mod tidy
	cd user-service && go mod tidy

.PHONY: test
test: ## Run unit tests across all microservices
	@echo "Running tests..."
	go test -v ./...

# ==============================================================================
# Help Documentation
# ==============================================================================

.PHONY: help
help: ## Display this help screen
	@echo "Available Commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'
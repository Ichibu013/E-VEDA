# E-VEDA Backend

The robust, scalable, and microservices-based backend for the E-VEDA platform. Built with Go, gRPC, and Docker, this architecture ensures high performance, maintainability, and seamless scalability to power the next generation of AI-driven education solutions.

---

## Architecture & Execution Flow

The backend leverages an API Gateway pattern where external HTTP/REST clients interact with a central entry point. The Gateway routes traffic internally to domain-specific gRPC microservices. The services utilize standard relational databases alongside caching and specialized object storage.

```mermaid
graph TD
    %% Define Styles
    classDef client fill:#3498db,stroke:#2980b9,stroke-width:2px,color:#fff;
    classDef gateway fill:#2ecc71,stroke:#27ae60,stroke-width:2px,color:#fff;
    classDef service fill:#9b59b6,stroke:#8e44ad,stroke-width:2px,color:#fff;
    classDef storage fill:#f1c40f,stroke:#f39c12,stroke-width:2px,color:#333;
    classDef external fill:#e74c3c,stroke:#c0392b,stroke-width:2px,color:#fff;

    %% Nodes
    Client((Client App / Web)):::client
    API_GW[API Gateway<br/>HTTP :8080]:::gateway

    IAM[IAM Service<br/>gRPC :50052]:::service
    USER[User Service<br/>gRPC :50051]:::service

    DB[(PostgreSQL)]:::storage
    REDIS[(Redis Cache<br/>:6379)]:::storage
    MINIO[(MinIO Object Storage<br/>:9000)]:::storage

    GEMINI[Gemini AI API]:::external

    %% Connections
    Client -- "REST (JSON)" --> API_GW

    API_GW -- "gRPC (Protobuf)" --> IAM
    API_GW -- "gRPC (Protobuf)" --> USER

    IAM -- "Credentials/Auth Data" --> DB
    IAM -- "Session tokens" --> REDIS

    USER -- "Profiles/Progress" --> DB
    USER -- "Data Caching" --> REDIS
    USER -- "Avatars/Documents" --> MINIO
    USER -- "AI Analysis/Generation" --> GEMINI
```

### Execution Flow Details

1. **Client Request**: A client (mobile app or web frontend) makes a standard HTTP request to the API Gateway.
2. **Gateway Routing**: The `api-gateway` validates the request, strips off necessary headers, and marshals the JSON payload into Protocol Buffers.
3. **gRPC Invocation**: The Gateway acts as a gRPC client, calling the appropriate internal microservice (`iam-service` for auth/identity, `user-service` for profile/content).
4. **Service Execution**:
   - The microservice processes the business logic.
   - For fast, ephemeral data (like sessions), it reads/writes to `Redis`.
   - For persistent state, it interacts with `PostgreSQL`.
   - For file assets (e.g., profile pictures), the `user-service` manages pre-signed URLs or direct uploads via `MinIO`.
   - Background tasks or external API calls (e.g., `Gemini AI` processing or `SMTP` emails) are fired off as needed.
5. **Response**: The microservice replies via gRPC back to the gateway. The gateway translates the Protobuf response back to JSON and returns it to the client.

---

## Key Features

- **Microservices Architecture**: Strictly separated boundaries for `iam-service` and `user-service` ensuring independent deployments and scalability.
- **gRPC Communication**: Supercharged internal communication between services using Protocol Buffers (`proto`), drastically reducing serialization overhead.
- **API Gateway**: A single, robust entry point for all client requests, abstracting away the complexity of the backend topology.
- **High-Performance Storage Layers**:
  - Relational database capabilities via PostgreSQL.
  - In-memory data store via Redis for lightning-fast caching and session management.
  - S3-compatible Object Storage via MinIO for handling user uploads and static assets securely.
- **AI Integration**: Deep integration with the Gemini AI API for intelligent user data processing and educational insights.
- **Go Workspaces**: Modern Go 1.18+ workspace (`go.work`) structure for easy local development across multiple modules.
- **Containerized Environment**: 100% Dockerized setup using `docker-compose` for reproducible development, testing, and production environments.

---

## 🛠 Prerequisites

Ensure you have the following installed on your machine:
- [Docker](https://docs.docker.com/get-docker/) & [Docker Compose](https://docs.docker.com/compose/install/)
- [Go](https://go.dev/doc/install) (1.20+ recommended)
- `make` utility
- `protoc` (Protocol Buffers Compiler - if generating new proto files)

---

## Quick Start

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Backend
   ```

2. **Environment Configuration**:
   Create a `.env` file in the root directory. You must supply your own database connection string and API keys:
   ```env
   # PostgreSQL Connection
   DATABASE_URL=postgres://user:password@host:5432/dbname

   # External Integrations
   GEMINI_API_KEY=your_gemini_api_key

   # Optional: SMTP Configuration (for IAM emails)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   ```

3. **Start the Infrastructure (Docker Compose)**:
   We use `Makefile` commands to wrap common operations. To start everything:
   ```bash
   make up
   ```
   *Alternatively, run `docker compose up --build -d` directly.*

   This will bring up:
   - Redis container
   - MinIO Object Storage (and a setup script to create buckets automatically)
   - IAM Service (Go + gRPC)
   - User Service (Go + gRPC)
   - API Gateway (Go + HTTP)

4. **Verify the Deployment**:
   - **API Gateway**: `http://localhost:8080` (Try `GET /health` if implemented)
   - **MinIO Console**: `http://localhost:9001`
     - Username: `minioadmin`
     - Password: `minioadmin`

---

## Project Structure

```text
Backend/
├── api-gateway/       # Go service: REST API entry point routing to internal gRPC endpoints
├── iam-service/       # Go service: Identity, Authentication, and Access Management
├── user-service/      # Go service: User profiles, AI integrations, and assets
├── proto/             # Protocol Buffer definitions defining the internal API contracts
├── api-docs/          # Swagger/OpenAPI documentation
├── docker-compose.yml # Infrastructure orchestration for local dev/testing
├── go.work            # Go workspace configuration linking the microservices
└── Makefile           # Centralized script for build, test, and run commands
```

---

## Useful Commands (Makefile)

The project includes a comprehensive `Makefile` to simplify development workflows. Run `make help` to see all options.

| Command | Description |
|---------|-------------|
| `make up` | Start the entire microservice stack in the background |
| `make down` | Stop and remove all containers, networks, and volumes |
| `make logs` | Tail the logs for all services in real-time |
| `make proto`| Compile the gRPC Protocol Buffer contracts (`proto/` to Go code) |
| `make tidy` | Sync the Go workspace and tidy all module dependencies |
| `make test` | Run unit tests across all microservices |

---

## Ports Overview

When running locally, the following ports are mapped to your host machine:

| Service | Protocol | Port | Purpose |
|---------|----------|------|---------|
| API Gateway | HTTP | `8080` | Client entrypoint (Frontend connects here) |
| IAM Service | gRPC | `50052` | Internal auth/identity calls |
| User Service | gRPC | `50051` | Internal user/profile calls |
| Redis | TCP | `6379` | Cache / Session store access |
| MinIO API | HTTP | `9000` | S3-compatible API for file uploads |
| MinIO Console| HTTP | `9001` | Web UI to manage MinIO buckets |

---

## Contributing

1. **Protocol Buffers First**: Any new feature requiring cross-service communication starts in the `proto/` directory. Define your service and messages, then run `make proto`.
2. **Code Style**: Ensure you write standard, idiomatic Go. Use `gofmt` and `make tidy` before committing.
3. **Branching**: Follow standard Git flow. Create a branch, commit your changes, and submit a PR against `main`.

---
*Built for the E-VEDA Platform.*

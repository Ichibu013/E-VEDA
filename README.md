# E-VEDA

E-VEDA is an integrated AI-powered mental state assessment platform for education and healthcare. It combines a React/Vite web frontend, Go-based microservices backend, and a Python multimodal AI system that analyzes audio and video to infer emotion, attention, and stress.

> **BE Computer Final Year Project** by Students of **Keystone School of Engineering, Pune, IN**
> Under the guidance of **Prof. Vrushali Wankhade**

## Project Members

1. **Ansh Sharma** [Project Lead]
2. **Divesh Sonawane** [AI System Developer]
3. **Shreeyash Shinde** [Frontend Developer]
4. **Srushti Shinde** [UI/UX Designer + Frontend Developer]

### Module Contributors

- **AI System**: Divesh Sonawane and Ansh Sharma
- **Frontend**: Shreeyash Shinde, Srushti Shinde, and Ansh Sharma
- **Backend**: Ansh Sharma

## Project Overview

- **Frontend**: React with Vite for responsive UI, user authentication, report generation, and dashboard interactions.
- **Backend**: Go microservices in a gRPC architecture with an API gateway, Redis cache, MinIO object storage, and PostgreSQL compatibility.
- **AI System**: FastAPI-based multimodal analysis module that processes audio, facial, gaze, and skeletal data to produce semantic mental state predictions.

## Architecture

```mermaid
flowchart LR
    A[User Browser] -->|HTTPS| B(Frontend App)
    B -->|REST API| C[API Gateway]
    C -->|gRPC| D[IAM Service]
    C -->|gRPC| E[User Service]
    E -->|HTTP| F[E-VEDA AI API]
    D -->|Redis| G[(Redis Cache)]
    E -->|Object Store| H[(MinIO)]
    D -->|DB| I[(PostgreSQL)]
    E -->|DB| I[(PostgreSQL)]

    subgraph Frontend
      B
    end

    subgraph Backend Services
      C
      D
      E
    end

    subgraph Infrastructure
      G
      H
      I
    end

    subgraph AI System
      F
    end
```

### Data Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Gateway
    participant IAM
    participant UserSvc
    participant AI
    participant Storage

    User->>Frontend: Sign in / request report
    Frontend->>Gateway: POST /api/... (JSON)
    Gateway->>IAM: gRPC Authenticate / Authorize
    Gateway->>UserSvc: gRPC Fetch profile / reports
    UserSvc->>AI: HTTP POST /analyze (media URLs)
    AI->>Storage: download media / process data
    AI-->>UserSvc: analysis results
    UserSvc-->>Gateway: response payload
    Gateway-->>Frontend: JSON response
    Frontend-->>User: render dashboard
```

### Full Execution Flow

```mermaid
flowchart TD
    %% User Actions
    U_Login[User logs into platform] --> U_Record[User records audio/video for assessment]
    U_Record --> F_Upload[Frontend uploads media to MinIO Storage]
    
    %% Frontend to Backend
    F_Upload --> F_Req[Frontend requests analysis via API Gateway]
    
    %% API Gateway & Auth
    F_Req --> GW_Auth[API Gateway validates request & calls IAM Service]
    GW_Auth --> IAM_Check{Is Authorized?}
    
    %% Unauth Flow
    IAM_Check -- No --> Auth_Fail[Return 401/403 Unauthorized]
    Auth_Fail --> F_Error[Frontend displays error]
    
    %% Auth Flow
    IAM_Check -- Yes --> GW_Route[API Gateway routes to User Service]
    
    %% User Service to AI
    GW_Route --> US_ReqAI[User Service sends media URLs to AI System]
    
    %% AI Processing Pipeline
    US_ReqAI --> AI_DL[AI System downloads media from MinIO]
    AI_DL --> AI_Process[AI multiprocessing: Audio, Gaze, Face, Skeleton]
    AI_Process --> AI_Fuse[AI Semantically fuses modal data]
    AI_Fuse --> AI_Res[AI returns mental state metrics]
    
    %% Backend Finalization
    AI_Res --> US_Save[User Service saves report to PostgreSQL]
    US_Save --> GW_Res[User Service returns report data to API Gateway]
    
    %% Return to User
    GW_Res --> F_Display[Frontend receives JSON and renders Dashboard]
    F_Display --> U_View[User views assessment results]
```

## Repository Structure

```text
E-VEDA/
├── Backend/          # Go microservices backend and Docker compose orchestration
├── Frontend/         # React + Vite web client
├── aiSystem/         # Python FastAPI multimodal AI inference system
└── README.md         # Root project documentation
```

## Key Features

- Multimodal emotion and mental state fusion using audio, facial, gaze, and skeletal signals.
- Modern frontend using React, Tailwind, and CoreUI components.
- Microservices architecture with API gateway and gRPC service contracts.
- Dockerized local development with Redis, MinIO, and backend containers.
- AI integration for semantic report generation and educational insights.

## Getting Started

### Prerequisites

- Docker & Docker Compose
- Node.js (v18+ recommended)
- npm (for `frontend`)
- Python 3.10 (for `aiSystem`)
- Optional: Go 1.20+ (for `backend`)

### Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

Open the app in your browser at the URL displayed by Vite.

### Backend Setup

```bash
cd Backend
# Recommended: set environment variables in a .env file
docker compose up --build -d
```

If the repository includes a `Makefile`, you can also use:

```bash
cd Backend
make up
```

### AI System Setup

```bash
cd aiSystem
python -m pip install -r requirements.txt
python api.py
```

The AI API listens on `http://0.0.0.0:8000` by default.

## Important Ports

| Service | Default Local Port |
|---|---|
| Frontend (Vite) | `5173` |
| API Gateway | `8080` |
| IAM Service gRPC | `50052` |
| User Service gRPC | `50051` |
| Redis | `6379` |
| MinIO API | `9000` |
| MinIO Console | `9001` |
| AI System | `8000` |

## Subproject Documentation

- `Backend/README.md` — Backend architecture, microservice details, and Docker instructions.
- `aiSystem/README.md` — Multimodal AI API usage, inference flow, and model details.
- `Frontend/` — React app configuration and available scripts in `package.json`.

## Notes

- The `Backend/docker-compose.yml` orchestrates the microservice stack and storage dependencies.
- `aiSystem` uses local model files stored under `aiSystem/models/` for audio, gaze, and facial inference.
- The `Frontend` is designed to connect to the backend API gateway, so ensure the gateway is running when testing the UI.

## Contributing

1. Fork the repository and create a feature branch.
2. Open a pull request against the current branch.
3. Add or update documentation for any major changes.
4. Run formatting, linting, and tests where applicable.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

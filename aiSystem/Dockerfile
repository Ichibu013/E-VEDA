# ==========================================
# Stage 1: Dependency Wheels Compiler
# ==========================================
FROM python:3.10-slim AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# Build dependency wheels into a local cache directory
RUN pip wheel --no-cache-dir --no-deps --wheel-dir /app/wheels -r requirements.txt

# ==========================================
# Stage 2: Runtime Environment Optimization
# ==========================================
FROM python:3.10-slim

WORKDIR /app

# Install explicit shared system objects required by OpenCV, Mediapipe, and Librosa
# Fixed: Swapped legacy libgl1-mesa-glx with modern libgl1 and libglx-mesa0
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglx-mesa0 \
    libglib2.0-0 \
    libsndfile1 \
    curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Pull the compiled binary components from Stage 1
COPY --from=builder /app/wheels /workspace/wheels
COPY --from=builder /app/requirements.txt .

RUN pip install --no-cache-dir /workspace/wheels/*

# Copy raw source modules along with trained static binaries/weights
COPY . .

EXPOSE 8000

# Run using production Gunicorn workers wrapping the Uvicorn worker instance
CMD ["python", "api.py"]

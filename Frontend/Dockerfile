# ==========================================
# Stage 1: Build & Compilations
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --silent

COPY . .
RUN npm run build

# ==========================================
# Stage 2: Minimal Web Server Runtime
# ==========================================
FROM nginx:1.25-alpine

# Copy client asset targets straight to Nginx document root directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Custom nginx server block to resolve React SPA routing history pathways correctly
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $$uri $$uri/ /index.html; \
    } \
    location /api/ { \
        proxy_pass http://api-gateway:8080; \
        proxy_set_header Host $$host; \
        proxy_set_header X-Real-IP $$remote_addr; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

# Stage 1: build JS modules
FROM node:20 AS builder

WORKDIR /app

# Copy package.json + package-lock.json (nếu có)
COPY package*.json ./

# Cài dependencies
RUN npm install

# Copy source code
COPY . .

# Build dist/init.js
RUN npm run build

# Stage 2: chạy Nakama
FROM heroiclabs/nakama:3.22.0

# Copy dist vào Nakama modules
COPY --from=builder /app/dist /nakama/data/modules

# Entrypoint Nakama giữ nguyên, config qua docker-compose

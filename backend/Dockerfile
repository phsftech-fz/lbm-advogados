# --- Stage 1: Build ---
# Debian (slim) evita erros de OpenSSL/libssl do Prisma em Alpine
FROM node:20-slim AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY prisma ./prisma/
RUN npx prisma generate

COPY tsconfig.json ./
COPY src ./src/
RUN npm run build

# --- Stage 2: Runtime ---
FROM node:20-slim AS runtime

WORKDIR /app

# Instalamos todas as deps (incl. Prisma) para rodar migrate no startup
COPY package.json package-lock.json ./
RUN npm ci

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Script de entrada: generate, migrações e depois inicia a API
RUN echo '#!/bin/sh' > /entrypoint.sh && \
    echo 'set -e' >> /entrypoint.sh && \
    echo 'npx prisma generate' >> /entrypoint.sh && \
    echo 'npx prisma migrate deploy' >> /entrypoint.sh && \
    echo 'exec node dist/index.js' >> /entrypoint.sh && \
    chmod +x /entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/entrypoint.sh"]

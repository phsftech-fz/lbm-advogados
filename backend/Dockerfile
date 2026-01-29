FROM node:20-slim

RUN apt-get update -y && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY prisma ./prisma/
COPY tsconfig.json ./
COPY src ./src/

RUN npx prisma generate && npm run build

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && exec node dist/index.js"]

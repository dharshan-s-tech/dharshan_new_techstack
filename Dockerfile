FROM node:20-alpine AS base


# ==========================================
# Dependencies
# ==========================================
FROM base AS deps

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci


# ==========================================
# Build
# ==========================================
FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN npm run build


# ==========================================
# Production
# ==========================================
FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production

# Application files
COPY --from=builder /app/public ./public

# Next.js build output
COPY --from=builder /app/.next ./.next

# Required runtime dependencies
COPY --from=builder /app/node_modules ./node_modules

# Package configuration
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]
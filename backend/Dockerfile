# ---- Stage 1: Build ----
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --only=production=false

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ---- Stage 2: Production ----
FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

# Copy compiled output and production deps
COPY --from=builder /app/dist ./dist
COPY package.json package-lock.json* ./
RUN npm ci --only=production && npm cache clean --force

# Non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 4000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:4000/health || exit 1

CMD ["node", "dist/index.js"]

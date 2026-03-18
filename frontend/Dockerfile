# ---- Stage 1: Build ----
FROM node:20-alpine AS builder
WORKDIR /app

# Build args for env vars (passed at build time)
ARG VITE_API_URL=http://localhost:4000
ARG VITE_GTM_ID=
ARG VITE_APP_ENV=production
ARG VITE_APP_VERSION=2.0.0

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_GTM_ID=$VITE_GTM_ID
ENV VITE_APP_ENV=$VITE_APP_ENV
ENV VITE_APP_VERSION=$VITE_APP_VERSION

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

# ---- Stage 2: Nginx ----
FROM nginx:1.25-alpine AS production

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Custom nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Non-root user
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]

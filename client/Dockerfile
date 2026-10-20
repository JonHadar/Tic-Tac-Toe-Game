# Build stage: type-check and bundle the React app with Vite
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Runtime stage: serve the static files with nginx, which also proxies /api to the server
FROM nginx:1.31-alpine
# Pick up security fixes released since the base image was built.
RUN apk upgrade --no-cache
# The nginx image renders /etc/nginx/templates/*.template into conf.d at
# startup, substituting environment variables such as API_UPSTREAM.
ENV API_UPSTREAM=http://server:5000
COPY templates /etc/nginx/templates
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ > /dev/null || exit 1

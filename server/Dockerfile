# Build stage: compile TypeScript to JavaScript
FROM node:26-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Runtime stage: production dependencies and compiled code only
FROM node:26-alpine
ENV NODE_ENV=production \
    PORT=5000
WORKDIR /app
COPY package*.json ./
# Install production dependencies, then remove npm itself: it is not needed
# at runtime and its bundled packages are a common source of vulnerabilities.
RUN apk upgrade --no-cache \
    && npm ci --omit=dev \
    && npm cache clean --force \
    && rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx /opt/yarn* \
              /usr/local/lib/node_modules/corepack /usr/local/bin/corepack
COPY --from=build /app/dist ./dist
USER node
EXPOSE 5000
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- "http://127.0.0.1:${PORT}/api/health" > /dev/null || exit 1
CMD ["node", "dist/server.js"]

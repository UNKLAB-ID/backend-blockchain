# Multi-stage Production Dockerfile for better security and smaller image
FROM node:18-alpine AS base

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app directory and user
WORKDIR /usr/src/app
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Copy package files
COPY package*.json ./

# Dependencies stage
FROM base AS dependencies

# Install all dependencies
RUN npm ci --include=dev

# Build stage
FROM dependencies AS build

# Copy source code
COPY . .

# Run tests and linting
RUN npm run lint
RUN npm run test

# Remove dev dependencies for smaller image
RUN npm prune --omit=dev

# Production stage
FROM base AS production

# Copy only production node_modules and built application
COPY --from=build --chown=nodejs:nodejs /usr/src/app/node_modules ./node_modules
COPY --from=build --chown=nodejs:nodejs /usr/src/app/src ./src
COPY --from=build --chown=nodejs:nodejs /usr/src/app/package.json ./package.json

# Security: Use non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health/simple', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Use dumb-init for proper signal handling and start the application
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "src/server.js"]
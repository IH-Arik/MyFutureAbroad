FROM node:22-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Build TypeScript
RUN npm run build

# Production stage
FROM node:22-alpine AS runtime
WORKDIR /app

# Copy only production dependencies
COPY package*.json ./
RUN npm install --production

# Copy built source from builder
COPY --from=builder /app/dist ./dist

# Expose port (matches server.ts and compose.prod.yml)
EXPOSE 3001

# Start the server
CMD ["npm", "run", "start"]
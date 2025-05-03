FROM node:16-alpine as build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:16-alpine

WORKDIR /app

# Copy package files and install production dependencies only
COPY package*.json ./
RUN npm ci --only=production

# Copy the .env file into the container
COPY .env .env

# Copy built application from build stage
COPY --from=build /app/dist ./dist

# Set environment variables
ENV NODE_ENV=production

# Expose the application port
EXPOSE 8080

# Start the application
CMD ["node", "dist/main"]
# Build Backend
FROM golang:1.21-alpine AS backend-builder
WORKDIR /app/server
COPY server/go.mod server/go.sum ./
RUN go mod download
COPY server/ .
RUN go build -o main .

# Build Frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ .
RUN npm run build

# Final Stage
FROM alpine:latest
WORKDIR /root/
COPY --from=backend-builder /app/server/main .
COPY --from=frontend-builder /app/client/dist ./dist
EXPOSE 8080
CMD ["./main"]
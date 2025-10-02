# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copiar package files
COPY package*.json ./
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Build argument para la API URL
ARG VITE_API_URL=https://api.cryptoworld.cloud/api
ENV VITE_API_URL=$VITE_API_URL

# Build
RUN npm run build

# Production stage
FROM nginx:alpine

# Instalar certificados SSL
RUN apk add --no-cache ca-certificates

# Copiar nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar build
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer puerto
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
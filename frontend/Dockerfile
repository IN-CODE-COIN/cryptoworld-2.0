# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar TODAS las dependencias (incluyendo devDependencies para el build)
RUN npm ci

# Copiar código fuente
COPY . .

# Build argument para la API URL
ARG VITE_API_URL=https://api.cryptoworld.cloud/api
ENV VITE_API_URL=$VITE_API_URL

# Build de producción
RUN npm run build

# Production stage
FROM nginx:alpine

# Instalar certificados SSL
RUN apk add --no-cache ca-certificates

# Crear directorio de nginx
RUN mkdir -p /usr/share/nginx/html

# Copiar nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar build desde stage anterior
COPY --from=build /app/dist /usr/share/nginx/html

# Permisos
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Exponer puerto
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Comando
CMD ["nginx", "-g", "daemon off;"]
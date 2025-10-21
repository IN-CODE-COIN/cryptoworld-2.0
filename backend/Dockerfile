# ==============================
# 1️⃣ Etapa de construcción (Build)
# ==============================
FROM composer:2 AS vendor

WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install --no-dev --no-interaction --optimize-autoloader --prefer-dist --no-scripts --ignore-platform-reqs

# ==============================
# 2️⃣ Etapa final (Runtime)
# ==============================
FROM php:8.2-fpm

RUN apt-get update && apt-get install -y \
    libzip-dev zip unzip git curl libpng-dev libonig-dev libxml2-dev \
    nginx supervisor \
    && docker-php-ext-install pdo_mysql zip bcmath exif \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

# Copiar código y dependencias
COPY . .
COPY --from=vendor /app/vendor ./vendor

# ✅ Crear carpetas necesarias si no existen
RUN mkdir -p storage bootstrap/cache public \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Configurar Nginx y Supervisor
COPY docker/nginx/default.conf /etc/nginx/sites-available/default
COPY docker/supervisor/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
    CMD curl -fsS http://localhost/ || exit 1

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]

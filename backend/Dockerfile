# ============================================
# Dockerfile Laravel listo para Coolify (FIXED)
# ============================================

FROM php:8.2-fpm

# =========================
# Variables de entorno
# =========================
ARG APP_ENV=production
ENV APP_ENV=${APP_ENV}

# =========================
# Directorio de trabajo
# =========================
WORKDIR /var/www

# =========================
# Instalar dependencias del sistema
# =========================
RUN apt-get update && apt-get install -y \
    libzip-dev \
    zip \
    unzip \
    git \
    curl \
    wget \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    nginx \
    gettext-base \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo_mysql zip bcmath exif gd pcntl opcache \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# =========================
# Instalar Composer
# =========================
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# =========================
# Copiar composer.json para cache
# =========================
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-interaction --optimize-autoloader --prefer-dist --no-scripts

# =========================
# Copiar código
# =========================
COPY . .

# =========================
# Autoload optimizado
# =========================
RUN composer dump-autoload --optimize

# =========================
# Permisos
# =========================
RUN chown -R www-data:www-data /var/www \
    && chmod -R 775 /var/www/storage \
    && chmod -R 775 /var/www/bootstrap/cache

# =========================
# Configuración Nginx (usando template para PORT dinámico)
# =========================
COPY docker/nginx/default.conf /etc/nginx/sites-available/default.template
RUN PORT=${PORT:-80} \
    && envsubst '${PORT}' < /etc/nginx/sites-available/default.template > /etc/nginx/sites-available/default \
    && rm -f /etc/nginx/sites-enabled/default \
    && ln -sf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default

# =========================
# Configuración Supervisor
# =========================
RUN echo '[supervisord]\n\
nodaemon=true\n\
user=root\n\
logfile=/dev/stdout\n\
logfile_maxbytes=0\n\
\n\
[program:php-fpm]\n\
command=/usr/local/sbin/php-fpm -F\n\
autostart=true\n\
autorestart=true\n\
priority=5\n\
stdout_logfile=/dev/stdout\n\
stdout_logfile_maxbytes=0\n\
stderr_logfile=/dev/stderr\n\
stderr_logfile_maxbytes=0\n\
\n\
[program:nginx]\n\
command=/usr/sbin/nginx -g "daemon off;"\n\
autostart=true\n\
autorestart=true\n\
priority=10\n\
stdout_logfile=/dev/stdout\n\
stdout_logfile_maxbytes=0\n\
stderr_logfile=/dev/stderr\n\
stderr_logfile_maxbytes=0\n\
' > /etc/supervisor/conf.d/supervisord.conf

# =========================
# Exponer puertos
# =========================
EXPOSE 80 8000

# =========================
# CMD según entorno
# =========================
# Producción: Nginx + PHP-FPM con Supervisor
# Desarrollo: php artisan serve en puerto 8000
CMD if [ "$APP_ENV" = "development" ]; then \
        php artisan serve --host=0.0.0.0 --port=8000; \
    else \
        /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf; \
    fi

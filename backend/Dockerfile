# ============================================
# Dockerfile Laravel para desarrollo y producción
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
    supervisor \
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
# Configuración Nginx
# =========================
COPY docker/nginx/default.conf /etc/nginx/sites-available/default
RUN rm -f /etc/nginx/sites-enabled/default \
    && ln -sf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default

# =========================
# Configuración Supervisor
# =========================
RUN echo "[supervisord]\nnodaemon=true\nuser=root\n\n[program:php-fpm]\ncommand=/usr/local/sbin/php-fpm -F\nautostart=true\nautorestart=true\n\n[program:nginx]\ncommand=/usr/sbin/nginx -g 'daemon off;'\nautostart=true\nautorestart=true\n" > /etc/supervisor/conf.d/supervisord.conf

# =========================
# Exponer puertos
# =========================
EXPOSE 80 8000

# =========================
# CMD
# =========================
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]

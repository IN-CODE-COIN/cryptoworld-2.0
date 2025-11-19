# ============================================
# Dockerfile Laravel listo para Coolify (FIXED)
# ============================================

FROM php:8.2-fpm

WORKDIR /var/www

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

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

COPY composer.json composer.lock ./
RUN composer install --no-dev --no-interaction --optimize-autoloader --prefer-dist --no-scripts

COPY . .

RUN composer dump-autoload --optimize

RUN chown -R www-data:www-data /var/www \
    && chmod -R 775 storage bootstrap/cache

# ============================
# USAR SOLO TU ARCHIVO NGINX
# ============================
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf.template




EXPOSE 80

RUN echo '#!/bin/bash\nPORT=${PORT:-80}\nenvsubst '\''${PORT}'\'' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf\nphp-fpm -D\nnginx -g "daemon off;"' > /usr/local/bin/start.sh && chmod +x /usr/local/bin/start.sh

CMD ["/usr/local/bin/start.sh"]

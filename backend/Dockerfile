###########################
# 1) Composer stage (PHP 8.2)
###########################
FROM composer:2.2-php8.2 AS composer_stage

WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install --no-dev --prefer-dist --optimize-autoloader --no-interaction

COPY . .
RUN composer dump-autoload --optimize


###########################
# 2) PHP + Nginx final
###########################
FROM php:8.2-fpm

# Instalar extensiones y nginx
RUN apt-get update && apt-get install -y \
    nginx \
    libzip-dev zip unzip \
    git curl \
    && docker-php-ext-install pdo pdo_mysql \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www

# Copiar aplicación
COPY --from=composer_stage /app ./

# Copiar nginx config
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf

# Permisos
RUN chown -R www-data:www-data /var/www \
    && chmod -R 775 storage \
    && chmod -R 775 bootstrap/cache

# Puerto Coolify
ENV PORT=80
EXPOSE ${PORT}

RUN echo "clear_env=no" >> /usr/local/etc/php-fpm.conf

CMD service php-fpm start && nginx -g "daemon off;"

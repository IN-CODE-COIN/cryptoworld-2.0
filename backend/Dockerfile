#############################################
# 1) Composer stage with PHP 8.2
#############################################
FROM php:8.2-cli AS composer_stage

RUN apt-get update && apt-get install -y \
    unzip git curl libzip-dev zip \
    && docker-php-ext-install zip

# Install composer manually
RUN curl -sS https://getcomposer.org/installer | php \
    && mv composer.phar /usr/local/bin/composer

WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install --no-dev --prefer-dist --no-interaction --optimize-autoloader

COPY . .
RUN composer dump-autoload --optimize


#############################################
# 2) Runtime: PHP-FPM + Nginx
#############################################
FROM php:8.2-fpm

RUN apt-get update && apt-get install -y \
    nginx libzip-dev zip unzip git curl supervisor \
    && docker-php-ext-install pdo pdo_mysql zip \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www

# Copy app from composer stage
COPY --from=composer_stage /app ./


#############################################
# NGINX CONFIG
#############################################
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf


#############################################
# PERMISSIONS
#############################################
RUN chown -R www-data:www-data /var/www \
    && chmod -R 775 storage \
    && chmod -R 775 bootstrap/cache


#############################################
# SUPERVISOR
#############################################
RUN mkdir -p /etc/supervisor/conf.d

COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf


#############################################
# PORT (required by Coolify)
#############################################
ENV PORT=80
EXPOSE 80


#############################################
# ENTRYPOINT
#############################################
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]

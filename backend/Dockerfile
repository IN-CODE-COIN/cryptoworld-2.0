###########################
# 1) STAGE: Composer
###########################
FROM composer:2 AS composer_stage

WORKDIR /app

# Copiar composer.json para cache eficiente
COPY composer.json composer.lock ./

# Instalar dependencias sin dev para producción
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Ahora copiamos todo el proyecto
COPY . .

# Regenerar autoload optimizado
RUN composer dump-autoload --optimize


###########################
# 2) Final Image: PHP + Nginx
###########################
FROM php:8.2-fpm

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    nginx \
    supervisor \
    libzip-dev \
    zip unzip \
    git curl \
    && docker-php-ext-install pdo pdo_mysql \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www

# Copiar aplicación del stage composer
COPY --from=composer_stage /app ./

# Copiar config nginx
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf

# Permisos Laravel
RUN chown -R www-data:www-data /var/www \
    && chmod -R 775 storage bootstrap/cache

# Deshabilitar daemon de php-fpm
RUN echo "clear_env=no" >> /usr/local/etc/php-fpm.conf

# Nginx port
ENV PORT=80

# Exponer el puerto para plataformas PaaS
EXPOSE ${PORT}

##################################
# Comando final del contenedor
##################################
CMD service php-fpm start && nginx -g "daemon off;"

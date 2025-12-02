FROM php:8.2-fpm

ARG APP_ENV=production
ENV APP_ENV=${APP_ENV}

WORKDIR /var/www

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    build-essential \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    locales \
    zip \
    jpegoptim optipng pngquant gifsicle \
    vim \
    unzip \
    git \
    curl \
    libzip-dev \
    libonig-dev \
    libxml2-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Instalar extensiones PHP
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo_mysql mbstring zip exif pcntl gd opcache

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copiar archivos de la aplicación
COPY . /var/www

# Instalar dependencias de Composer
RUN composer install --optimize-autoloader --no-dev

# ← ELIMINA O COMENTA ESTA LÍNEA si no tienes el archivo
# COPY ./php/local.ini /usr/local/etc/php/conf.d/local.ini

# Cambiar permisos
RUN chown -R www-data:www-data /var/www \
    && chmod -R 755 /var/www/storage \
    && chmod -R 755 /var/www/bootstrap/cache

# Exponer puerto 9000 para PHP-FPM
EXPOSE 9000

CMD ["php-fpm"]
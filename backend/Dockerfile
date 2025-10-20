# ==============================
# 1️⃣ Etapa de construcción (Build)
# ==============================
FROM composer:2 AS vendor

WORKDIR /app

# Copiamos solo lo necesario para instalar dependencias
COPY composer.json composer.lock ./

# Instalamos dependencias sin las de desarrollo
RUN composer install --no-dev --no-interaction --optimize-autoloader --prefer-dist


# ==============================
# 2️⃣ Etapa final (Runtime)
# ==============================
FROM php:8.4-fpm

# Instalar extensiones requeridas por Laravel
RUN apt-get update && apt-get install -y \
    libzip-dev zip unzip git curl libpng-dev libonig-dev libxml2-dev \
    && docker-php-ext-install pdo_mysql zip bcmath exif \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Configurar el directorio de trabajo
WORKDIR /var/www

# Copiar el código de la aplicación
COPY . .

# Copiar las dependencias de Composer desde la etapa anterior
COPY --from=vendor /app/vendor ./vendor

# Ajustar permisos para Laravel
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache \
    && chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Caches de Laravel para optimizar rendimiento (solo si no hay env)
RUN php artisan config:clear || true \
    && php artisan route:clear || true \
    && php artisan view:clear || true

# Exponer puerto FPM
EXPOSE 9000

# Comando por defecto
CMD ["php-fpm"]

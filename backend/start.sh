#!/bin/bash

# Script de inicio para Dokploi
# Este script se ejecuta después del despliegue

set -e

echo "🚀 Iniciando configuración de Laravel..."

# Asegurarse de que los directorios tengan permisos correctos
chmod -R 775 storage bootstrap/cache

# Limpiar cachés
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear

# Ejecutar migraciones
php artisan migrate --force

# Cachear configuraciones para mejor rendimiento
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Generar JWT secret si no existe
php artisan jwt:secret --force || true

echo "✅ Configuración completada"

# Iniciar PHP-FPM
php-fpm

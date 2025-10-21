#!/bin/bash
set -e

echo "🚀 Starting Laravel Application..."

# Esperar a que la base de datos esté lista
if [ ! -z "$DB_HOST" ]; then
    echo "⏳ Waiting for database..."
    max_tries=30
    count=0
    until php artisan db:show > /dev/null 2>&1 || [ $count -eq $max_tries ]; do
        count=$((count+1))
        echo "   Attempt $count/$max_tries..."
        sleep 2
    done
    
    if [ $count -eq $max_tries ]; then
        echo "⚠️  Warning: Could not connect to database, but continuing..."
    else
        echo "✅ Database connection successful"
    fi
fi

# Ejecutar migraciones
echo "🔄 Running migrations..."
php artisan migrate --force || echo "⚠️  Migrations failed or already applied"

# Cachear configuraciones
echo "⚡ Caching configurations..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "✅ Application ready!"

# Iniciar supervisor (PHP-FPM + Nginx)
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf

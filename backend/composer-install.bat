@echo off
echo Instalando dependencias de Composer...
echo Esto puede tardar varios minutos...
echo.

set COMPOSER_DISABLE_XDEBUG_WARN=1
set COMPOSER_MEMORY_LIMIT=-1

composer install --no-interaction --prefer-dist --optimize-autoloader

if errorlevel 1 (
    echo.
    echo ERROR: La instalacion fallo
    echo Intentando con --ignore-platform-reqs...
    echo.
    composer install --no-interaction --prefer-dist --optimize-autoloader --ignore-platform-reqs
)

echo.
echo Instalacion completada!
pause

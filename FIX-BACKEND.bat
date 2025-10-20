@echo off
cls
echo ========================================
echo   REPARAR BACKEND - CryptoWorld 2.0
echo ========================================
echo.
echo Este script instalara las dependencias
echo de Composer. Puede tardar 10-15 minutos.
echo.
echo IMPORTANTE: Necesitas conexion a Internet
echo.
pause

cd backend

echo.
echo [1/5] Limpiando instalacion anterior...
if exist vendor (
    echo Eliminando vendor/...
    rmdir /s /q vendor
)
if exist composer.lock (
    echo Eliminando composer.lock...
    del composer.lock
)

echo.
echo [2/5] Verificando Composer...
composer --version
if errorlevel 1 (
    echo ERROR: Composer no esta instalado
    echo Descargalo de: https://getcomposer.org/download/
    pause
    exit /b 1
)

echo.
echo [3/5] Configurando Composer para evitar SSL...
composer config secure-http false
composer config disable-tls true

echo.
echo [4/5] Instalando dependencias...
echo Esto tardara varios minutos, NO cierres esta ventana...
echo.

set COMPOSER_MEMORY_LIMIT=-1
set COMPOSER_DISABLE_XDEBUG_WARN=1

composer install --no-interaction --prefer-dist --no-dev

if errorlevel 1 (
    echo.
    echo ERROR en la instalacion
    echo Intentando con todas las dependencias...
    composer install --no-interaction --prefer-dist
    
    if errorlevel 1 (
        echo.
        echo ERROR: No se pudieron instalar las dependencias
        echo.
        echo Posibles soluciones:
        echo 1. Verifica tu conexion a Internet
        echo 2. Desactiva temporalmente tu antivirus/firewall
        echo 3. Ejecuta como Administrador
        echo 4. Verifica que PHP este instalado: php -v
        echo.
        pause
        exit /b 1
    )
)

echo.
echo [5/5] Verificando instalacion...
if exist vendor\laravel\framework\src\Illuminate\Foundation\resources\server.php (
    echo [OK] Laravel framework instalado correctamente
) else (
    echo [ERROR] Laravel framework no se instalo completamente
    pause
    exit /b 1
)

echo.
echo ========================================
echo   INSTALACION COMPLETADA!
echo ========================================
echo.
echo Ahora ejecuta:
echo   php artisan key:generate
echo   php artisan jwt:secret
echo   php artisan migrate
echo   php artisan serve
echo.
pause

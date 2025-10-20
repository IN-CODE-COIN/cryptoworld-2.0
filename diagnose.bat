@echo off
echo ================================
echo   DIAGNOSTICO - CryptoWorld 2.0
echo ================================
echo.

echo [Verificando PHP...]
php -v
echo.

echo [Verificando Composer...]
composer --version
echo.

echo [Verificando Node...]
node -v
echo.

echo [Verificando npm...]
npm -v
echo.

echo ================================
echo   BACKEND
echo ================================

echo [Verificando vendor/...]
cd backend
if exist vendor (
    echo [OK] vendor/ existe
) else (
    echo [ERROR] vendor/ NO existe - ejecuta: composer install
)
echo.

echo [Verificando .env...]
if exist .env (
    echo [OK] .env existe
) else (
    echo [ERROR] .env NO existe - ejecuta: copy .env.local .env
)
echo.

echo [Verificando permisos...]
if exist storage\logs\laravel.log (
    echo [OK] storage/logs es escribible
) else (
    echo [WARNING] storage/logs puede tener problemas de permisos
)
echo.

echo [Laravel Environment...]
php artisan env
echo.

echo [Verificando APP_KEY...]
php artisan tinker --execute="echo env('APP_KEY') ? 'APP_KEY: OK' : 'APP_KEY: NO CONFIGURADA';"
echo.

echo [Verificando conexion BD...]
php artisan db:show
echo.

echo [Estado migraciones...]
php artisan migrate:status
echo.

echo ================================
echo   FRONTEND
echo ================================

cd ..\frontend

echo [Verificando node_modules/...]
if exist node_modules (
    echo [OK] node_modules/ existe
) else (
    echo [ERROR] node_modules/ NO existe - ejecuta: npm install
)
echo.

echo [Verificando .env...]
if exist .env (
    echo [OK] .env existe
) else (
    echo [ERROR] .env NO existe - ejecuta: copy .env.local .env
)
echo.

cd ..

echo ================================
echo   RESUMEN
echo ================================
echo.
echo Si todo esta OK, ejecuta:
echo.
echo   Terminal 1:
echo   cd backend
echo   php artisan serve
echo.
echo   Terminal 2:
echo   cd frontend  
echo   npm run dev
echo.
echo ================================
pause

@echo off
echo ================================
echo   CryptoWorld 2.0 - Instalacion
echo ================================
echo.

echo [1/7] Instalando dependencias del backend...
cd backend
if exist vendor (
    echo Vendor ya existe, omitiendo...
) else (
    call composer install
    if errorlevel 1 (
        echo ERROR: Fallo al instalar dependencias de Composer
        pause
        exit /b 1
    )
)

echo.
echo [2/7] Configurando archivo .env del backend...
if exist .env (
    echo .env ya existe, omitiendo...
) else (
    copy .env.local .env
    echo .env creado desde .env.local
)

echo.
echo [3/7] Generando APP_KEY...
php artisan key:generate
if errorlevel 1 (
    echo ERROR: Fallo al generar APP_KEY
    pause
    exit /b 1
)

echo.
echo [4/7] Generando JWT_SECRET...
php artisan jwt:secret -f
if errorlevel 1 (
    echo WARNING: jwt:secret no disponible, ejecutalo manualmente despues
)

echo.
echo [5/7] Instalando dependencias del frontend...
cd ..\frontend
if exist node_modules (
    echo node_modules ya existe, omitiendo...
) else (
    call npm install
    if errorlevel 1 (
        echo ERROR: Fallo al instalar dependencias de npm
        pause
        exit /b 1
    )
)

echo.
echo [6/7] Configurando archivo .env del frontend...
if exist .env (
    echo .env ya existe, omitiendo...
) else (
    copy .env.local .env
    echo .env creado desde .env.local
)

cd ..

echo.
echo [7/7] Instalacion completada!
echo.
echo ================================
echo   SIGUIENTES PASOS:
echo ================================
echo.
echo 1. Crea la base de datos 'cryptoworld' en phpMyAdmin
echo    URL: http://localhost/phpmyadmin
echo.
echo 2. Ejecuta las migraciones:
echo    cd backend
echo    php artisan migrate
echo.
echo 3. Inicia el backend:
echo    cd backend
echo    php artisan serve
echo.
echo 4. Inicia el frontend (en otra terminal):
echo    cd frontend
echo    npm run dev
echo.
echo 5. Abre tu navegador en:
echo    Frontend: http://localhost:5173
echo    Backend:  http://localhost:8000
echo.
echo ================================
pause

@echo off
echo ========================================
echo   PREPARAR DESPLIEGUE A DOKPLOI
echo ========================================
echo.
echo Este script hara commit y push de los
echo cambios necesarios para Dokploi
echo.
pause

echo.
echo [1/3] Agregando archivos al commit...
git add backend/Dockerfile
git add backend/docker/nginx/default.conf
git add backend/docker/supervisor/supervisord.conf
git add backend/.env.dokploi
git add DEPLOYMENT.md

echo.
echo [2/3] Haciendo commit...
git commit -m "fix: Actualizar Dockerfile para Dokploi con PHP 8.2 y Nginx"

if errorlevel 1 (
    echo No hay cambios para commitear o error en el commit
)

echo.
echo [3/3] Enviando a GitHub...
git push origin main

if errorlevel 1 (
    echo ERROR: No se pudo hacer push
    echo Verifica que tengas permisos en el repositorio
    pause
    exit /b 1
)

echo.
echo ========================================
echo   PUSH COMPLETADO
echo ========================================
echo.
echo Ahora ve a Dokploi y:
echo 1. Asegurate de que el servicio backend este configurado correctamente
echo 2. Haz un nuevo deployment
echo 3. Verifica los logs
echo.
pause

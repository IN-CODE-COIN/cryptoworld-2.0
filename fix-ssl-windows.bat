@echo off
cls
echo ========================================
echo   SOLUCIONAR ERROR SSL - Windows/XAMPP
echo ========================================
echo.
echo Este script descargara el certificado
echo SSL y configurara PHP automaticamente.
echo.
pause

echo.
echo [1/3] Descargando certificado cacert.pem...
echo.

if not exist "C:\xampp\php\extras\ssl" mkdir "C:\xampp\php\extras\ssl"

curl -o "C:\xampp\php\extras\ssl\cacert.pem" https://curl.se/ca/cacert.pem

if errorlevel 1 (
    echo ERROR: No se pudo descargar el certificado
    echo Descargalo manualmente de: https://curl.se/ca/cacert.pem
    echo Y guardalo en: C:\xampp\php\extras\ssl\cacert.pem
    pause
    exit /b 1
)

echo [OK] Certificado descargado

echo.
echo [2/3] Configurando php.ini...
echo.

set PHP_INI=C:\xampp\XAMPP\php\php.ini

if not exist "%PHP_INI%" (
    echo ERROR: No se encuentra php.ini en %PHP_INI%
    pause
    exit /b 1
)

echo Buscando configuracion actual...
findstr /C:"curl.cainfo" "%PHP_INI%" > nul
if errorlevel 1 (
    echo Agregando configuracion SSL a php.ini...
    echo. >> "%PHP_INI%"
    echo ; Certificados SSL para cURL >> "%PHP_INI%"
    echo curl.cainfo = "C:\xampp\php\extras\ssl\cacert.pem" >> "%PHP_INI%"
    echo openssl.cafile = "C:\xampp\php\extras\ssl\cacert.pem" >> "%PHP_INI%"
    echo [OK] Configuracion agregada
) else (
    echo [WARNING] La configuracion ya existe en php.ini
    echo Verifica que apunte a: C:\xampp\php\extras\ssl\cacert.pem
)

echo.
echo [3/3] Verificando configuracion...
php -i | findstr "curl.cainfo"

echo.
echo ========================================
echo   CONFIGURACION COMPLETADA
echo ========================================
echo.
echo IMPORTANTE:
echo 1. Reinicia Apache en XAMPP Control Panel
echo 2. Cierra y vuelve a abrir esta terminal
echo 3. Vuelve a ejecutar: php artisan serve
echo.
pause

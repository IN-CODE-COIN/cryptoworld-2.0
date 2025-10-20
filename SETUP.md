# 🛠️ Guía de Configuración Local - CryptoWorld 2.0

## ⚠️ Problema de Certificados SSL en Windows/XAMPP

Si tienes errores de SSL al instalar dependencias con Composer, sigue estos pasos:

### Solución 1: Descargar cacert.pem

1. Descarga el certificado: https://curl.se/ca/cacert.pem
2. Guárdalo en: `C:\xampp\php\extras\ssl\cacert.pem`
3. Edita `C:\xampp\php\php.ini` y añade/modifica:
   ```ini
   curl.cainfo = "C:\xampp\php\extras\ssl\cacert.pem"
   openssl.cafile = "C:\xampp\php\extras\ssl\cacert.pem"
   ```
4. Reinicia Apache/Terminal

### Solución 2: Desactivar verificación SSL (solo desarrollo)

Edita `C:\xampp\php\php.ini`:
```ini
curl.cainfo = ""
openssl.cafile = ""
```

O ejecuta con variable de entorno:
```bash
set COMPOSER_DISABLE_NETWORK=0
composer install --no-scripts
```

---

## 📦 Instalación del Backend (Laravel)

### 1. Instalar dependencias:

**⚠️ IMPORTANTE:** Si tienes una instalación incompleta, límpiala primero:
```bash
cd backend
rmdir /s /q vendor
del composer.lock
```

Luego instala:
```bash
composer install --no-interaction --prefer-dist --optimize-autoloader
```

Si hay problemas de SSL o timeouts:
```bash
composer install --no-interaction --prefer-dist --optimize-autoloader --ignore-platform-reqs
```

O usa el script automático:
```bash
composer-install.bat
```

### 2. Configurar archivo .env:

```bash
# Copia el archivo de ejemplo
copy .env.production .env

# O crea uno nuevo con estos valores mínimos
```

**Contenido mínimo del .env:**

```env
APP_NAME=CryptoWorld
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

FRONTEND_URL=http://localhost:5173

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=cryptoworld
DB_USERNAME=root
DB_PASSWORD=

JWT_SECRET=
JWT_TTL=60

COINRANKING_API_KEY=tu_api_key_aqui

SESSION_DRIVER=cookie
SESSION_LIFETIME=120
CACHE_STORE=file
QUEUE_CONNECTION=sync
```

### 3. Generar claves:

```bash
php artisan key:generate
php artisan jwt:secret
```

### 4. Crear base de datos en phpMyAdmin:

1. Abre: http://localhost/phpmyadmin
2. Crea una base de datos llamada: `cryptoworld`
3. Usa el conjunto de caracteres: `utf8mb4_unicode_ci`

### 5. Ejecutar migraciones:

```bash
php artisan migrate
```

### 6. Dar permisos (si hay errores):

```bash
# Windows (PowerShell como Administrador)
icacls "storage" /grant Users:F /T
icacls "bootstrap\cache" /grant Users:F /T
```

### 7. Iniciar servidor:

```bash
php artisan serve
```

El backend estará en: http://localhost:8000

---

## 🎨 Instalación del Frontend (React + Vite)

### 1. Instalar dependencias:

```bash
cd frontend
npm install
```

### 2. Configurar archivo .env:

```bash
# Crea un archivo .env con:
```

```env
VITE_API_URL=http://localhost:8000/api
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_NAME=CryptoWorld
```

### 3. Iniciar servidor de desarrollo:

```bash
npm run dev
```

El frontend estará en: http://localhost:5173

---

## 🧪 Verificar que funciona

### Backend:

```bash
curl http://localhost:8000/api/health
```

O abre en el navegador: http://localhost:8000/api

### Frontend:

Abre: http://localhost:5173

---

## 🐛 Problemas Comunes y Soluciones

### Error: "vendor/autoload.php not found"

```bash
cd backend
composer install
```

### Error: "APP_KEY not set"

```bash
php artisan key:generate
```

### Error: "JWT secret not set"

```bash
php artisan jwt:secret
```

### Error: "SQLSTATE[HY000] [1045] Access denied"

Verifica en `.env`:
- `DB_HOST=127.0.0.1`
- `DB_USERNAME=root`
- `DB_PASSWORD=` (vacío en XAMPP por defecto)
- Que la base de datos `cryptoworld` exista

### Error: "file_put_contents(storage/logs/laravel.log): failed to open stream"

```bash
# Windows (PowerShell Admin)
icacls "storage" /grant Users:F /T
icacls "bootstrap\cache" /grant Users:F /T
```

### Error de CORS en el frontend

Verifica que:
1. Backend esté corriendo en `http://localhost:8000`
2. Frontend `.env` tenga: `VITE_API_URL=http://localhost:8000/api`
3. El archivo `backend/config/cors.php` incluya `http://localhost:5173`

### Frontend no conecta con Backend

1. Verifica que ambos servidores estén corriendo
2. Abre la consola del navegador (F12) para ver errores
3. Verifica las URLs en `frontend/.env`

---

## 📋 Checklist de Instalación

### Backend:
- [ ] Composer instalado
- [ ] Dependencias de PHP instaladas (`composer install`)
- [ ] Archivo `.env` configurado
- [ ] `APP_KEY` generada
- [ ] `JWT_SECRET` generada
- [ ] Base de datos `cryptoworld` creada en phpMyAdmin
- [ ] Migraciones ejecutadas
- [ ] Servidor Laravel corriendo (`php artisan serve`)

### Frontend:
- [ ] Node.js instalado (versión 18 o superior)
- [ ] Dependencias instaladas (`npm install`)
- [ ] Archivo `.env` configurado
- [ ] Servidor Vite corriendo (`npm run dev`)

---

## 🚀 Scripts Útiles

### Backend:

```bash
# Limpiar cachés
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Ver rutas disponibles
php artisan route:list

# Ejecutar tests
php artisan test

# Refrescar base de datos (⚠️ borra todo)
php artisan migrate:fresh --seed
```

### Frontend:

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview

# Tests
npm run test

# Tests con cobertura
npm run test:coverage

# Lint
npm run lint
```

---

## 🆘 Si nada funciona

1. **Reinicia los servicios de XAMPP** (Apache y MySQL)
2. **Limpia todo y reinstala**:

   Backend:
   ```bash
   cd backend
   rmdir /s /q vendor
   del composer.lock
   composer install
   ```

   Frontend:
   ```bash
   cd frontend
   rmdir /s /q node_modules
   del package-lock.json
   npm install
   ```

3. **Verifica versiones**:
   ```bash
   php -v        # Debe ser PHP 8.2+
   composer -V   # Debe estar instalado
   node -v       # Debe ser Node 18+
   npm -v        # Debe estar instalado
   ```

---

## 📞 Contacto

Si continúan los problemas:
- Sergio López Ruiz
- Email: sergio.lopezr.88@gmail.com

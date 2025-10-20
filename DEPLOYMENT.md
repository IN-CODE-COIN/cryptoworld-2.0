# 🚀 Guía de Despliegue - CryptoWorld 2.0

## 📋 Requisitos previos

- Cuenta en Dokploi (Backend + Base de datos)
- Cuenta en Vercel (Frontend)
- Dominio: cryptoworld.cloud configurado

---

## 1️⃣ Despliegue de Base de Datos en Dokploi

### Configurar servicio MySQL:

1. En Dokploi, crea un servicio MySQL
2. Configura las credenciales:
   - **Database Name:** `cryptoworld`
   - **Username:** `tu_usuario` (guárdalo)
   - **Password:** `genera_password_seguro` (guárdalo)
3. Una vez creado, anota el **host interno** (ej: `mysql-service.dokploi.internal`)

### phpMyAdmin (Opcional):

Si despliegas con docker-compose local:
- Accede a phpMyAdmin en: `http://localhost:8080`
- Usuario: `laravel` / Password: el que configuraste en DB_PASSWORD

---

## 2️⃣ Despliegue del Backend (Laravel) en Dokploi

### A. Configurar el servicio Backend:

1. Crea un nuevo servicio en Dokploi
2. Conecta tu repositorio GitHub: `https://github.com/IN-CODE-COIN/cryptoworld-2.0`
3. Configura:
   - **Branch:** `main` (o la que uses)
   - **Root directory:** `backend`
   - **Build Type:** `Dockerfile`
   - **Dockerfile Path:** `Dockerfile`
   - **Internal Port:** `80` (puerto donde escucha nginx dentro del contenedor)
   - **Start Command:** Déjalo VACÍO (usa el CMD del Dockerfile con supervisord)

### B. Variables de entorno:

En la sección de Environment Variables de Dokploi, copia el contenido de `backend/.env.dokploi` y rellena:

**⚠️ IMPORTANTE - Rellena estos valores:**

```env
APP_KEY=                    # Genera con: php artisan key:generate --show
DB_HOST=                    # Host MySQL interno de Dokploi
DB_DATABASE=cryptoworld
DB_USERNAME=                # Usuario MySQL de Dokploi
DB_PASSWORD=                # Password MySQL de Dokploi
JWT_SECRET=                 # Genera con: php artisan jwt:secret --show
COINRANKING_API_KEY=        # Tu API key de CoinRanking
```

### C. Verificar configuración de Dokploi:

**⚠️ IMPORTANTE - NO uses `php artisan serve` en producción:**

- **Build Command:** Vacío (el Dockerfile lo maneja)
- **Start Command:** Vacío (usa el CMD del Dockerfile: supervisord con nginx + php-fpm)
- **Internal Port:** 80
- Si el deploy falla, verifica dentro del contenedor:
  ```bash
  ps aux | egrep "nginx|php-fpm"
  ss -lntp | grep ":80"
  ```

### D. Dominio y SSL:

1. Configura el dominio: `api.cryptoworld.cloud`
2. Activa SSL/HTTPS automático

---

## 3️⃣ Despliegue del Frontend (React) en Vercel

### A. Importar proyecto:

1. Ve a Vercel Dashboard
2. Click en "Add New Project"
3. Importa tu repositorio GitHub
4. Configura:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### B. Variables de entorno:

En Vercel Project Settings > Environment Variables, añade:

```env
VITE_API_URL=https://api.cryptoworld.cloud/api
VITE_API_BASE_URL=https://api.cryptoworld.cloud
VITE_APP_NAME=CryptoWorld
```

### C. Dominio:

1. Ve a Settings > Domains
2. Añade: `cryptoworld.cloud`
3. Configura los DNS según las instrucciones de Vercel

---

## 4️⃣ Verificación Post-Despliegue

### Backend:

```bash
# Verificar que el backend responde
curl https://api.cryptoworld.cloud/api/health

# Verificar base de datos (si tienes endpoint de status)
curl https://api.cryptoworld.cloud/api/status
```

### Frontend:

1. Visita: https://cryptoworld.cloud
2. Verifica que carga correctamente
3. Intenta hacer login/registro
4. Verifica que se comunica con el backend

---

## 5️⃣ Comandos útiles para Dokploi

### Ejecutar migraciones:
```bash
php artisan migrate --force
```

### Limpiar cachés:
```bash
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

### Ver logs:
```bash
tail -f storage/logs/laravel.log
```

---

## 🔧 Solución de Problemas Comunes

### Error 500 en Backend:

1. Verifica que `APP_KEY` y `JWT_SECRET` estén configurados
2. Verifica permisos en `storage/` y `bootstrap/cache/`
3. Revisa logs: `storage/logs/laravel.log`

### Error de CORS:

1. Verifica que `FRONTEND_URL` en backend sea: `https://cryptoworld.cloud`
2. Verifica configuración en `backend/config/cors.php`

### Error de conexión a Base de Datos:

1. Verifica que `DB_HOST`, `DB_USERNAME`, `DB_PASSWORD` sean correctos
2. Verifica que el servicio MySQL esté corriendo en Dokploi

### Frontend no conecta con Backend:

1. Verifica que `VITE_API_URL` en Vercel sea correcto
2. Verifica que el backend responda en `https://api.cryptoworld.cloud`
3. Verifica CORS en backend

---

## 📝 Checklist de Despliegue

- [ ] Servicio MySQL creado en Dokploi
- [ ] Variables de entorno configuradas en backend
- [ ] `APP_KEY` generada
- [ ] `JWT_SECRET` generada
- [ ] Backend desplegado en Dokploi
- [ ] Dominio `api.cryptoworld.cloud` configurado con SSL
- [ ] Migraciones ejecutadas en producción
- [ ] Variables de entorno configuradas en Vercel
- [ ] Frontend desplegado en Vercel
- [ ] Dominio `cryptoworld.cloud` configurado
- [ ] Verificación de conexión backend-frontend
- [ ] Pruebas de login/registro

---

## 🎯 URLs Finales

- **Frontend:** https://cryptoworld.cloud
- **Backend API:** https://api.cryptoworld.cloud
- **Base de datos:** Interna en Dokploi

---

## 🆘 Soporte

Para problemas, contacta con:
- Sergio López Ruiz
- Email: sergio.lopezr.88@gmail.com

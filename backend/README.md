
# Cryptoworld

Este proyecto es una aplicación Laravel que incluye una plataforma de consulta, seguimiento y creación de carteras de cryptomondas, tambien incluye una API REST accesible desde rutas como `/api/users` donde puedes consultar todos los usuarios registrados en la plataforma.

## 🛠 Tecnologías Utilizadas

- **Laravel 10** – Framework backend en PHP.
- **Blade** – Motor de plantillas para el frontend.
- **JavaScript (ES6+)** – Scripts personalizados para funcionalidades interactivas.
- **Tailwind CSS** – Frameworks de estilos (dependiendo de la configuración del proyecto).
- **MySQL** – Sistema de gestión de base de datos.
- **Laravel Breeze** – Para autenticación simple.
- **Vite** – Herramienta de compilación frontend.
- **L5-Swagger** – Documentación automática de la API.

---


## 🌐 Descripción General

La aplicación contiene:

- Un sistema de registro y autenticación visual accesible desde `/register` y `/login`.
- Un dashboard accesible tras iniciar sesión en `/home`donde podras ver un listado de las principales cryptomonedas ordenadas por capitalización de mercado.
- Un listado personalizado en `/watchlist` donde podras agregar hasta 5 cryptomonedas o bien sin límite para los usuarios 'pro'
- Un apartado solo para usuarios 'pro' alojado en `/wallet` donde podrás crear tu propia cartera de cryptomonedas y hacer el seguimiento de la rentabilidad en tiempo real, tanto de cada cryptomoneda como de toda la cartera.

   Para realizar esta creación deberás agregar(retirar) saldo a(de) tu cuenta en `/wallet/create` y realizar la compra(venta) de cryptomonedas en `/wallet/transaction/create`.

- Todos los movimientos estarán disponibles en `/wallet/moves`
- En `/pricing` se muestran los diferentes planes de la plataforma (gratuito/pro o free trial de 7 días)

- Una API pública o autenticada en rutas como `/api/users`.

---

## 📁 Estructura de Carpetas

### `routes/`
Contiene los archivos de rutas del proyecto.

- `web.php` – Rutas web, que renderizan vistas Blade como login, home, wallet, etc.
- `api.php` – Rutas para la API REST (e.g., `/api/users`).

### `resources/`

#### `resources/views/`
Contiene todas las vistas Blade (`.blade.php`) utilizadas para renderizar el frontend.

- `home.blade.php`, `create.blade.php` – Páginas de inicio y creación de cartera.

##### `auth/`
Vistas del sistema de autenticación:
- `login.blade.php`, `register.blade.php`, `forgot-password.blade.php`, etc.

##### `components/`
Componentes reutilizables en las vistas:
- Botones, formularios, modales, navegación, etc.

##### `layouts/`
Diseños base de las páginas:
- `app.blade.php` – Layout principal.
- `home.blade.php`, `navigation.blade.php`, etc.

##### `pricing/`
Vista de precios o planes (`index.blade.php`).

##### `wallet/`
Vistas relacionadas con la funcionalidad de carteras:
- `create.blade.php`, `edit.blade.php`, `index.blade.php`, `moves.blade.php`
- `transaction/create.blade.php` – Para crear transacciones.

##### `watchlist/`
Vista para la funcionalidad de seguimiento (`index.blade.php`).

#### `resources/js/` y `resources/css/`
Contienen scripts JS y estilos CSS.

- `app.js`, `bootstrap.js`, `crypto-autocomplete.js` – Scripts usados en el frontend.
- `app.css` – Estilos CSS de la aplicación.

---

## 🚀 Puesta en Marcha

1. Instalar dependencias:
   ```bash
   composer install
   npm install && npm run build
   ```

2. Configurar el entorno:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

3. Migrar base de datos:
   ```bash
   php artisan migrate
   ```

4. Levantar el servidor:
   ```bash
   php artisan serve
   ```

5. Acceder desde el navegador:
   ```
   http://localhost:8000/login
   ```

---

## 📡 API REST

Las rutas de la API están definidas en `routes/api.php`.

Ejemplo de endpoint:
```
GET http://localhost:8000/api/users
```

---

## ✅ Autenticación

El sistema de login y registro usa vistas Blade y está disponible en:

```
http://localhost:8000/login
```

Una vez autenticado, el usuario es redirigido a:
```
http://localhost:8000/home
```

---

## Autor

✍️ **Sergio López Ruiz** – sergio.lopezr.88@gmail.com

# Cryptoworld 2.0

En la parte del backend, incluimos una API hecha con Laravel, desde donde vamos a servir toda la información al frontend via end points públicos y privados.

## 🛠 Tecnologías Utilizadas

-   **PHP 8.2** – Framework backend en PHP.
-   **Laravel 12.19** – Framework backend en PHP.
-   **MySQL** – Sistema de gestión de base de datos.
-   **L5-Swagger** – Documentación automática de la API.
-   **JWT (tymon/jwt-auth)** - Autenticación via tokens

---

## 🌐 Descripción General

La aplicación contiene:

-   Un sistema de registro y autenticación visual accesible desde `/register` y `/login`.
-   Un dashboard accesible tras iniciar sesión en `/home`donde podras ver un listado de las principales cryptomonedas ordenadas por capitalización de mercado.
-   Un listado personalizado en `/watchlist` donde podras agregar hasta 5 cryptomonedas o bien sin límite para los usuarios 'pro'
-   Un apartado solo para usuarios 'pro' alojado en `/wallet` donde podrás crear tu propia cartera de cryptomonedas y hacer el seguimiento de la rentabilidad en tiempo real, tanto de cada cryptomoneda como de toda la cartera.

    Para realizar esta creación deberás agregar(retirar) saldo a(de) tu cuenta en `/wallet/create` y realizar la compra(venta) de cryptomonedas en `/wallet/transaction/create`.

-   Todos los movimientos estarán disponibles en `/wallet/moves`
-   En `/pricing` se muestran los diferentes planes de la plataforma (gratuito/pro o free trial de 7 días)

---

## 📁 Estructura de Carpetas

### `routes/`

Contiene los archivos de rutas del proyecto.

-   `api.php` – Rutas para la API REST.

#### `app/Http/Controllers/Api`

Contiene todos los controladores necesarios para el funcionamiento de la aplicación.

-   `Auth.AuthController.php` – Autenticación.
-   `CryptoController.php` – Cryptomonedas.
-   `HomeController.php` – Inicio.
-   `PricingController.php` – Tarifas.
-   `UserController.php` – Control usuarios.
-   `WalletController.php` – Cartera.
-   `WatchlistController.php` – Lista de seguimiento.

---

#### `app/Docs/Schemas`

Contiene todos los ficheros para la gestión de las respuestas de los end points en Swagger (Schemas).

#### `app/Models`

Contiene todos los modelos de la aplicación.

#### `database/migrations`

Contiene todos las migraciones realizadas.

#### `storage/api-docs/api-docs.json`

Contiene el documento json generado por Swagger para obtener la documentación de la API.

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

## 📡 SWAGGER

Las ruta donde tengo acceso al documento con la información de los end points de la aplicación:

```
GET http://localhost:8000/api/documentation
```

---

## 🧪 Testing

El backend cuenta con pruebas automatizadas usando **PHPUnit** y datos de prueba con **Faker**.

-   Ejecutar pruebas:

    ```bash
    php artisan test
    ```

-   Ejecutar pruebas especificas:

    ```bash
    php artisan test --filter NombreDelTest
    ```

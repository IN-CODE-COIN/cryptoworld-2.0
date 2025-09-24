# Frontend – Cryptoworld 2.0

---

## 📖 Descripción

Este repositorio contiene el **frontend** de la plataforma de seguimiento de criptomonedas **Cryptoworld 2.0**, desarrollado con **React + Vite + TypeScript**.

El frontend se encarga de la **interfaz de usuario** y de la comunicación con el backend (API en Laravel), ofreciendo funcionalidades como:

- 🔍 Búsqueda y visualización de información de criptomonedas.
- 📋 Gestión de listas de seguimiento.
- 📊 Monitoreo de carteras y posiciones de usuario.
- 🎨 Interfaz moderna, responsiva y optimizada para todos los dispositivos.

---

## 🛠️ Tecnologías utilizadas

- **React 18** – Construcción de la interfaz.
- **TypeScript** – Tipado estático para mayor robustez.
- **Vite** – Entorno de desarrollo y build rápido.
- **Tailwind CSS + Flowbite + Ant Design** – Estilos y componentes de UI.
- **Axios** – Cliente HTTP para consumir la API.
- **React Router DOM** – Gestión de rutas.
- **React Icons + Remixicon** – Librerías de iconos.
- **EmailJS** – Integración con formulario de contacto para envio de emails.
- **Vitest + Testing Library** – Testing de componentes y lógica.

---

## 🚀 Instalación y ejecución

1. Clonar el repositorio y entrar en el directorio del frontend:

   ```bash
   git clone https://github.com/IN-CODE-COIN/cryptoworld-2.0.git
   cd cryptoworld-2.0/frontend
   ```

2. Instalar dependencias:

   ```bash
   npm install
   ```

3. Iniciar el servidor de desarrollo:

   ```bash
   npm run dev
   ```

4. Abrir el navegador:

   ```arduino
   http://localhost:5173
   ```

## 📂 Estructura del proyecto

```
frontend/
├── public/ # Archivos estáticos
├── src/
│ ├── components/ # Componentes reutilizables
| ├── config/ # Componentes de configuración para el front-end
│ ├── context/ # Componentes providers
│ ├── hooks/ # Custom hooks
│ ├── lib/ # Componente Axios
│ ├── pages/ # Vistas principales
│ ├── App.tsx # Punto de entrada de la aplicación
│ └── main.tsx # Renderizado principal
├── .env
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🧪 Testing

El frontend cuenta con pruebas configuradas mediante Vitest y React Testing Library.

- Ejecutar pruebas:

  ```bash
  npm run test
  ```

- Ejecutar con interfaz visual:

  ```bash
  npm run test:ui
  ```

- Generar reporte de cobertura:

  ```bash
  npm run test:coverage
  ```

import axios from "axios";
import { message } from "antd";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

console.log(import.meta.env.VITE_API_URL);
console.log("🔗 API URL configurada:", API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

// Interceptor para añadir el token JWT si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Error 401 - No autorizado
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      message.warning("Sesión caducada, vuelve a iniciar sesión.");
      window.location.href = "/";
    }

    // Error 403 - Prohibido
    if (error.response?.status === 403) {
      message.error("No tienes permisos para realizar esta acción.");
    }

    // Error 404 - No encontrado
    if (error.response?.status === 404) {
      message.error("Recurso no encontrado.");
    }

    // Error 500 - Error del servidor
    if (error.response?.status >= 500) {
      message.error("Error del servidor. Intenta más tarde.");
    }

    // Error de red
    if (!error.response) {
      message.error("Error de conexión. Verifica tu internet.");
    }

    return Promise.reject(error);
  }
);

export default api;

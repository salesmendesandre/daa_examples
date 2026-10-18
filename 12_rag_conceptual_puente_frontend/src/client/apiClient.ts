// src/client/apiClient.ts
import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json"
  }
});

// Interceptor de Petición: inyecta automáticamente el token Bearer JWT
apiClient.interceptors.request.use(config => {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de Respuesta: gestiona de forma global la expiración de sesión (401)
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

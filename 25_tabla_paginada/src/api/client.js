import axios from 'axios'

// La URL base sale de las variables de entorno de Vite (.env → VITE_API_URL).
// El valor por defecto permite arrancar el ejemplo aunque todavía no hayas creado el .env.
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3013/api'

export const apiClient = axios.create({
  baseURL,
  timeout: 10000 // ms: si la API no responde en 10 s, la petición falla con ECONNABORTED
})

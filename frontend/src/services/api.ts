import axios from "axios";

// Configuração da API base
const api = axios.create({
  baseURL: "http://localhost:8000/api", // URL do backend Django
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar o token JWT às requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Tratamento de erro de autenticação (401)
    if (error.response && error.response.status === 401) {
      // Redirecionar para login ou renovar token
      localStorage.removeItem("token");
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

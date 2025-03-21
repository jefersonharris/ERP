import api from "./api";
import {
  AuthResponse,
  LoginCredentials,
  RegisterUserData,
} from "@/interfaces/auth";

/**
 * Serviço para lidar com autenticação de usuários
 */
export const authService = {
  /**
   * Realiza o login do usuário
   * @param credentials Credenciais de login (username e password)
   * @returns Promise com dados do token de acesso e refresh
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/token/", credentials);
    // Armazena os tokens no localStorage
    localStorage.setItem("token", response.data.access);
    localStorage.setItem("refreshToken", response.data.refresh);
    return response.data;
  },

  /**
   * Realiza o logout do usuário
   */
  logout: (): void => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
  },

  /**
   * Renova o token de acesso usando o refresh token
   * @returns Promise com novo token de acesso
   */
  refreshToken: async (): Promise<{ access: string }> => {
    const refreshToken = localStorage.getItem("refreshToken");
    const response = await api.post<{ access: string }>("/token/refresh/", {
      refresh: refreshToken,
    });
    localStorage.setItem("token", response.data.access);
    return response.data;
  },

  /**
   * Verifica se o usuário está autenticado
   * @returns boolean indicando se está autenticado
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("token");
  },

  /**
   * Registra um novo usuário
   * @param userData Dados do usuário para registro
   * @returns Promise com resposta do servidor
   */
  register: async (userData: RegisterUserData): Promise<any> => {
    const response = await api.post("/users/register/", userData);
    return response.data;
  },
};

export default authService;

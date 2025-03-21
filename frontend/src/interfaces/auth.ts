// Interface para os dados de login
export interface LoginCredentials {
  username: string;
  password: string;
}

// Interface para a resposta de autenticação
export interface AuthResponse {
  access: string;
  refresh: string;
}

// Interface para o contexto de autenticação
export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
}

// Interface para os dados de registro de usuário
export interface RegisterUserData {
  first_name: string;
  last_name: string;
  job_title: string;
  corporate_email: string;
  username?: string; // Opcional, pois será gerado automaticamente
  password: string;
  password_confirm: string;
}

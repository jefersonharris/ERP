import api from "./api";

// Definição mínima dos dados do usuário
interface UserInfo {
  username: string;
  first_name: string;
  last_name: string;
  job_title: string;
  is_staff: boolean;
  is_superuser: boolean;
}

// Cache para armazenar temporariamente os dados do usuário
let userCache: UserInfo | null = null;

const userService = {
  // Obtém os dados do usuário autenticado
  getCurrentUser: async (): Promise<UserInfo | null> => {
    try {
      const response = await api.get<UserInfo>("/users/me/");
      userCache = response.data;
      return response.data;
    } catch (error) {
      console.error("Erro ao obter dados do usuário:", error);
      return null;
    }
  },

  // Obtém os dados do cache ou retorna null
  getCachedUser: (): UserInfo | null => {
    return userCache;
  },

  // Verifica se o usuário é administrador
  isAdmin: (): boolean => {
    return userCache ? userCache.is_staff || userCache.is_superuser : false;
  },

  // Formata o nome de exibição do usuário
  getDisplayName: (): string => {
    if (!userCache) return "Usuário";

    if (userCache.first_name || userCache.last_name) {
      return `${userCache.first_name} ${userCache.last_name}`.trim();
    }

    return userCache.username || "Usuário";
  },

  // Obtém o cargo do usuário
  getRole: (): string => {
    if (!userCache) return "Funcionário";

    if (userCache.is_staff || userCache.is_superuser) {
      return "Administrador";
    }

    return userCache.job_title || "Funcionário";
  },
};

export default userService;

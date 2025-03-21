"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { authFetch } from "@/lib/auth-fetch";

// Define o tipo de usuário retornado da API
type User = {
  first_name: string;
  last_name: string;
  email: string;
  avatar: string | null;
};

// Define o tipo do contexto de usuário
type UserContextType = {
  user: User | null;
  refreshUser: () => void;
};

// Cria o contexto com valor inicial undefined
const UserContext = createContext<UserContextType | undefined>(undefined);

// Hook personalizado para acessar o contexto
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser deve ser usado dentro de um <UserProvider>");
  }
  return context;
}

// Provider que gerencia o estado do usuário
export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = async () => {
    try {
      const res = await authFetch("/api/users/me/");
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        console.error("Erro ao buscar usuário:", res.status);
      }
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, refreshUser: fetchUser }}>
      {children}
    </UserContext.Provider>
  );
}

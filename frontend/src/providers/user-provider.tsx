// providers/user-provider.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { authFetch } from "@/lib/auth-fetch";

type User = {
  first_name: string;
  last_name: string;
  email: string;
  avatar: string | null;
};

type UserContextType = {
  user: User | null;
  refreshUser: () => void;
};

// Cria o contexto
export const UserContext = createContext<UserContextType | null>(null);

// Hook para acessar o contexto facilmente
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser deve ser usado dentro de um UserProvider");
  }
  return context;
}

// Provider que envolve a aplicação
export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = async () => {
    try {
      const res = await authFetch("http://localhost:8000/api/users/me/");
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    } catch (err) {
      console.error("Erro ao buscar usuário:", err);
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

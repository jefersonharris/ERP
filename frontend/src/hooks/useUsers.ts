"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

type DecodedUser = {
  email: string;
  job_title: string;
  exp: number;
  iat: number;
};

export function useUser() {
  const [user, setUser] = useState<DecodedUser | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      try {
        const decoded = jwtDecode<DecodedUser>(token);
        setUser(decoded);
      } catch (err) {
        console.error("Erro ao decodificar o token JWT:", err);
      }
    }
  }, []);

  return user;
}

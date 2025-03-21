"use client";

import { useAuth } from "@/hooks/useAuth";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { authenticated, loading } = useAuth();

  if (loading) return <p>Carregando...</p>;
  if (!authenticated) return null;

  return <>{children}</>;
}

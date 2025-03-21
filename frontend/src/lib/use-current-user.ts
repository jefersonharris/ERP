// lib/use-current-user.ts
import { useContext } from "react";
import { UserContext } from "@/providers/user-provider";

export function useCurrentUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useCurrentUser deve ser usado dentro de <UserProvider>");
  }
  return context;
}

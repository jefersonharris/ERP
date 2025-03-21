"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
      router.push("/login");
    }
    setLoading(false);
  }, []);

  return { authenticated, loading };
}

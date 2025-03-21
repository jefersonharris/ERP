"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/protected-route";
import { authFetch } from "@/lib/auth-fetch";

export const iframeHeight = "800px";
export const description = "A sidebar with a header and a search form.";

type UserData = {
  first_name: string;
  last_name: string;
  job_title: string;
  email: string;
};

export default function Page() {
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await authFetch("http://localhost:8000/api/users/me/");
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          console.error("Erro ao buscar usuário:", res.status);
        }
      } catch (err) {
        console.error("Erro na requisição:", err);
      }
    };

    fetchUser();
  }, []);

  return (
    <ProtectedRoute>
      <div className="flex flex-1 flex-col gap-4 p-4">
        {user && (
          <div className="text-muted-foreground text-sm">
            Bem-vindo,{" "}
            <strong>
              {user.first_name} {user.last_name}
            </strong>{" "}
            ({user.job_title})
          </div>
        )}
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="bg-muted/50 aspect-video rounded-xl" />
          <div className="bg-muted/50 aspect-video rounded-xl" />
          <div className="bg-muted/50 aspect-video rounded-xl" />
        </div>
        <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
      </div>
    </ProtectedRoute>
  );
}

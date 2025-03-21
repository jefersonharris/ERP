"use client";

import { useEffect, useState } from "react";
import { authFetch } from "@/lib/auth-fetch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

// Função para gerar iniciais do nome
function getInitials(first: string, last: string) {
  const firstInitial = first?.trim()?.[0]?.toUpperCase() ?? "";
  const lastInitial = last?.trim()?.[0]?.toUpperCase() ?? "";
  return firstInitial + lastInitial;
}

export default function ProfilePage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await authFetch("http://localhost:8000/api/users/me/");
        const data = await res.json();
        setFirstName(data.first_name);
        setLastName(data.last_name);
        setJobTitle(data.job_title);
        setAvatarPreview(data.avatar || null); // ✅ URL já vem completa do backend
      } catch (err) {
        console.error("Erro ao buscar dados do usuário", err);
      }
    };

    fetchUser();
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file)); // preview temporário
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("first_name", firstName.trim());
    formData.append("last_name", lastName.trim());
    formData.append("job_title", jobTitle.trim());
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    try {
      const res = await authFetch(
        "http://localhost:8000/api/users/me/update/",
        {
          method: "PATCH",
          body: formData,
        }
      );

      if (res.ok) {
        toast("Perfil atualizado com sucesso!");
      } else {
        const err = await res.json();
        toast.error("Erro ao atualizar: " + JSON.stringify(err));
      }
    } catch (error) {
      toast.error("Erro inesperado ao atualizar");
      console.error(error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Editar Perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-30 w-30">
                {avatarPreview ? (
                  <AvatarImage src={avatarPreview} alt="Avatar do usuário" />
                ) : (
                  <AvatarFallback>
                    {getInitials(firstName, lastName)}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex flex-col">
                <Label className="mb-2" htmlFor="avatar">
                  Foto de Perfil
                </Label>
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="mb-2" htmlFor="firstName">
                  Nome
                </Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label className="mb-2" htmlFor="lastName">
                  Sobrenome
                </Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label className="mb-2" htmlFor="jobTitle">
                Cargo
              </Label>
              <Input
                id="jobTitle"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Salvar Alterações
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

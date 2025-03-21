"use client";

import { useEffect, useState } from "react";
import { authFetch } from "@/lib/auth-fetch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

// Utilitário para gerar iniciais
function getInitials(first: string, last: string) {
  const f = first?.trim()?.[0]?.toUpperCase() ?? "";
  const l = last?.trim()?.[0]?.toUpperCase() ?? "";
  return `${f}${l}`;
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
        const res = await authFetch("/api/users/me/");
        const data = await res.json();
        setFirstName(data.first_name);
        setLastName(data.last_name);
        setJobTitle(data.job_title);
        setAvatarPreview(data.avatar || null); // URL completa do Django
      } catch (err) {
        console.error("Erro ao buscar usuário:", err);
        toast.error("Erro ao carregar perfil");
      }
    };

    fetchUser();
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file)); // preview local
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("first_name", firstName.trim());
    formData.append("last_name", lastName.trim());
    formData.append("job_title", jobTitle.trim());
    if (avatarFile) formData.append("avatar", avatarFile);

    try {
      const res = await authFetch("/api/users/me/update/", {
        method: "PATCH",
        body: formData,
      });

      if (res.ok) {
        toast.success("Perfil atualizado com sucesso!");
      } else {
        const err = await res.json();
        toast.error("Erro ao atualizar perfil", {
          description: JSON.stringify(err),
        });
      }
    } catch (err) {
      toast.error("Erro inesperado ao atualizar");
      console.error(err);
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
              <Avatar className="h-16 w-16">
                {avatarPreview ? (
                  <AvatarImage src={avatarPreview} alt="Foto de perfil" />
                ) : (
                  <AvatarFallback>
                    {getInitials(firstName, lastName)}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <Label htmlFor="avatar">Foto de Perfil</Label>
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
                <Label htmlFor="firstName">Nome</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Sobrenome</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="jobTitle">Cargo</Label>
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

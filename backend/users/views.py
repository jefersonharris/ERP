from django.shortcuts import render
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserRegistrationSerializer, UserProfileSerializer
from .models import UserProfile
from django.contrib.auth.models import User


class RegisterUserView(generics.CreateAPIView):
    """
    View para registrar novos usuários
    """

    permission_classes = [permissions.AllowAny]
    serializer_class = UserRegistrationSerializer


class CurrentUserView(APIView):
    """
    View para obter os dados do usuário autenticado
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """
        Retorna os dados do usuário autenticado
        """
        user = request.user
        try:
            profile = user.profile  # Garantimos que o perfil existe pelo OneToOneField
        except UserProfile.DoesNotExist:
            return Response({"error": "Perfil do usuário não encontrado"}, status=404)

        data = {
            "id": user.id,
            "username": user.username,
            "full_name": profile.full_name,  # Alterado de first_name + last_name para full_name
            "email": user.email,
            "is_staff": user.is_staff,
            "is_superuser": user.is_superuser,
            "last_login": user.last_login,
            "date_joined": user.date_joined,
            "job_title": profile.job_title,
        }

        return Response(data)

from rest_framework import generics, permissions
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import (
    UserRegistrationSerializer,
    EmailTokenObtainPairSerializer,
    UserUpdateSerializer,
)
from .models import CustomUser
from rest_framework.parsers import MultiPartParser, FormParser


class RegisterUserView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = UserRegistrationSerializer


class EmailLoginView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer


class CurrentUserView(APIView):
    """
    Retorna os dados do usuário autenticado
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        data = {
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "job_title": user.job_title,
            "avatar": (
                request.build_absolute_uri(user.avatar.url) if user.avatar else None
            ),
        }
        return Response(data)


class UpdateUserView(generics.UpdateAPIView):
    """
    Permite ao usuário autenticado atualizar seu perfil
    """

    queryset = CustomUser.objects.all()
    serializer_class = UserUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_object(self):
        return self.request.user

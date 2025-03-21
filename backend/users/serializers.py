from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from .models import UserProfile


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer para o perfil do usuário
    """

    class Meta:
        model = UserProfile
        fields = (
            "full_name",
            "job_title",
            "email",
        )  # Corrigido 'name' para 'full_name'


class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer para registro de usuários com campos do perfil
    """

    full_name = serializers.CharField(required=True)  # Alterado de name para full_name
    job_title = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    password_confirm = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = (
            "full_name",
            "password",
            "password_confirm",
            "job_title",
            "email",
        )

    def validate(self, attrs):
        # Verificar se as senhas coincidem
        if attrs["password"] != attrs["password_confirm"]:
            raise serializers.ValidationError({"password": "As senhas não coincidem"})

        # Verificar se o e-mail já existe
        if UserProfile.objects.filter(email=attrs["email"]).exists():
            raise serializers.ValidationError(
                {"email": "Já existe um usuário com este e-mail."}
            )
        return attrs

    def create(self, validated_data):
        # Remover os campos que não pertencem ao modelo User
        full_name = validated_data.pop("full_name")
        job_title = validated_data.pop("job_title")
        email = validated_data.pop("email")
        validated_data.pop("password_confirm")

        # Criar o usuário
        user = User.objects.create_user(username=email, email=email, **validated_data)

        # Atualiza o perfil automaticamente criado pelo post_save
        user.profile.full_name = full_name
        user.profile.job_title = job_title
        user.profile.email = email
        user.profile.save()

        return user

from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.core.mail import send_mail
from django.conf import settings
from .models import CustomUser


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = (
            "first_name",
            "last_name",
            "job_title",
            "email",
            "password",
            "password_confirm",
        )

    def validate(self, attrs):
        if attrs["password"] != attrs["password_confirm"]:
            raise serializers.ValidationError({"password": "As senhas não coincidem."})
        return attrs

    def create(self, validated_data):
        validated_data.pop("password_confirm")
        password = validated_data.pop("password")

        # Normaliza os campos
        first_name = validated_data["first_name"].strip().title()
        last_name = validated_data["last_name"].strip().title()
        email = validated_data["email"].strip().lower()
        job_title = validated_data["job_title"].strip().title()

        # Cria o usuário
        user = CustomUser.objects.create_user(
            first_name=first_name,
            last_name=last_name,
            email=email,
            job_title=job_title,
            password=password,
        )

        # Envia e-mail de boas-vindas
        try:
            send_mail(
                subject="Bem-vindo ao Sistema ERP Luminae!",
                message=(
                    f"Olá {first_name},\n\n"
                    "Seu cadastro foi realizado com sucesso em nossa plataforma ERP da Luminae.\n"
                    "Agora você pode acessar seu painel com o e-mail e senha cadastrados.\n\n"
                    "Estamos à disposição para qualquer dúvida.\n\n"
                    "Atenciosamente,\nEquipe Luminae"
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=False,
            )
        except Exception as e:
            print(f"[ERRO EMAIL] Falha ao enviar email para {email}: {e}")

        return user


class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["email"] = user.email
        token["job_title"] = user.job_title
        return token

    def validate(self, attrs):
        attrs["username"] = attrs.get("email")
        return super().validate(attrs)


class UserUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer para edição do perfil do usuário logado
    """

    class Meta:
        model = CustomUser
        fields = ("first_name", "last_name", "job_title", "avatar")

    def update(self, instance, validated_data):
        instance.first_name = (
            validated_data.get("first_name", instance.first_name).strip().title()
        )
        instance.last_name = (
            validated_data.get("last_name", instance.last_name).strip().title()
        )
        instance.job_title = (
            validated_data.get("job_title", instance.job_title).strip().title()
        )

        if "avatar" in validated_data:
            instance.avatar = validated_data["avatar"]

        instance.save()
        return instance

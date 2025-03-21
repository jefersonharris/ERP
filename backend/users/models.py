from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver


class UserProfile(models.Model):
    """
    Modelo para armazenar informações adcicionais do usuário
    """

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    first_name = models.CharField(max_length=80)
    last_name = models.CharField(max_length=120)
    job_title = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.last_name} {self.last_name}"


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """
    Cria um perfil de usuário automaticamente quando um novo usuário é criado
    """
    if created:
        UserProfile.objects.create(
            user=instance,
            first_name=instance.first_name,
            last_name=instance.last_name,
            email=instance.email,  # Mantém sincronizado com o User
        )


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    """
    Salva o perfil do usuário quando o usuário é atualizado
    """
    instance.profile.first_name = instance.first_name
    instance.profile.last_name = instance.last_name
    instance.profile.email = instance.email
    instance.profile.save()

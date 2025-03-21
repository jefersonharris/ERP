from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser
from django.utils.translation import gettext_lazy as _


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = (
        "email",
        "first_name",
        "last_name",
        "job_title",
        "is_staff",
        "created_at",
    )
    ordering = ("email",)
    search_fields = ("email", "first_name", "last_name", "job_title")

    readonly_fields = ("created_at", "updated_at", "last_login")  # ✅ aqui

    fieldsets = (
        (None, {"fields": ("email", "password")}),
        (
            _("Informações Pessoais"),
            {
                "fields": ("first_name", "last_name", "job_title", "avatar")
            },  # ✅ se tiver avatar
        ),
        (
            _("Permissões"),
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        (
            _("Datas Importantes"),
            {
                "fields": ("last_login", "created_at", "updated_at")
            },  # ✅ agora é read-only
        ),
    )

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "first_name",
                    "last_name",
                    "job_title",
                    "password1",
                    "password2",
                ),
            },
        ),
    )

from django.urls import path
from .views import (
    RegisterUserView,
    EmailLoginView,
    CurrentUserView,
    UpdateUserView,
)

urlpatterns = [
    path("register/", RegisterUserView.as_view(), name="register"),
    path("login/", EmailLoginView.as_view(), name="login"),
    path("me/", CurrentUserView.as_view(), name="current-user"),
    path(
        "me/update/", UpdateUserView.as_view(), name="update-user"
    ),  # ✅ Rota de edição
]

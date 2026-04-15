from django.urls import path

from .views import (
    backoffice_download_adoption_csv,
    backoffice_login,
    backoffice_logout,
    csrf_bootstrap,
    home,
    submit_adoption_form,
)

urlpatterns = [
    path("", home, name="home"),
    path("api/csrf/", csrf_bootstrap, name="csrf_bootstrap"),
    path("api/adoption/submit/", submit_adoption_form, name="submit_adoption_form"),
    path("backoffice/login/", backoffice_login, name="backoffice_login"),
    path("backoffice/logout/", backoffice_logout, name="backoffice_logout"),
    path(
        "backoffice/download/adoption/",
        backoffice_download_adoption_csv,
        name="backoffice_download_adoption_csv",
    ),
]

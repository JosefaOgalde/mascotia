from django.urls import path

from .views import (
    backoffice_download_adoption_csv,
    backoffice_download_newsletter_csv,
    backoffice_login,
    backoffice_logout,
    backoffice_newsletter,
    csrf_bootstrap,
    home,
    submit_adoption_form,
    subscribe_newsletter,
)

urlpatterns = [
    path("", home, name="home"),
    path("api/csrf/", csrf_bootstrap, name="csrf_bootstrap"),
    path("api/newsletter/subscribe/", subscribe_newsletter, name="subscribe_newsletter"),
    path("api/adoption/submit/", submit_adoption_form, name="submit_adoption_form"),
    path("backoffice/login/", backoffice_login, name="backoffice_login"),
    path("backoffice/logout/", backoffice_logout, name="backoffice_logout"),
    path("backoffice/newsletter/", backoffice_newsletter, name="backoffice_newsletter"),
    path(
        "backoffice/download/newsletter/",
        backoffice_download_newsletter_csv,
        name="backoffice_download_newsletter_csv",
    ),
    path(
        "backoffice/download/adoption/",
        backoffice_download_adoption_csv,
        name="backoffice_download_adoption_csv",
    ),
]

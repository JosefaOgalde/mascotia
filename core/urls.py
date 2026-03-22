from django.urls import path

from .views import (
    backoffice_login,
    backoffice_logout,
    backoffice_newsletter,
    home,
    submit_adoption_form,
    subscribe_newsletter,
)

urlpatterns = [
    path("", home, name="home"),
    path("api/newsletter/subscribe/", subscribe_newsletter, name="subscribe_newsletter"),
    path("api/adoption/submit/", submit_adoption_form, name="submit_adoption_form"),
    path("backoffice/login/", backoffice_login, name="backoffice_login"),
    path("backoffice/logout/", backoffice_logout, name="backoffice_logout"),
    path("backoffice/newsletter/", backoffice_newsletter, name="backoffice_newsletter"),
]

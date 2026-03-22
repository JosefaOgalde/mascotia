from django.urls import path

from .views import home, submit_adoption_form, subscribe_newsletter

urlpatterns = [
    path("", home, name="home"),
    path("api/newsletter/subscribe/", subscribe_newsletter, name="subscribe_newsletter"),
    path("api/adoption/submit/", submit_adoption_form, name="submit_adoption_form"),
]

from django.urls import path

from .views import home, subscribe_newsletter

urlpatterns = [
    path("", home, name="home"),
    path("api/newsletter/subscribe/", subscribe_newsletter, name="subscribe_newsletter"),
]

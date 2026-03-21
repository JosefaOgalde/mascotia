import json

from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST

from .models import Subscriber


@ensure_csrf_cookie
def home(request):
    return render(request, "base.html")


@require_POST
def subscribe_newsletter(request):
    email = ""

    if request.content_type and "application/json" in request.content_type:
        try:
            payload = json.loads(request.body.decode("utf-8"))
        except json.JSONDecodeError:
            payload = {}
        email = payload.get("email", "").strip().lower()
    else:
        email = request.POST.get("email", "").strip().lower()

    if not email:
        return JsonResponse({"ok": False, "message": "Ingresa un correo valido."}, status=400)

    subscriber, created = Subscriber.objects.get_or_create(email=email)

    if not created:
        return JsonResponse({"ok": True, "message": "Este correo ya estaba suscrito."})

    return JsonResponse({"ok": True, "message": "Suscripcion realizada con exito."})

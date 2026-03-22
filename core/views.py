import json

from django.core.mail import send_mail
from django.http import JsonResponse
from django.shortcuts import render
from django.conf import settings
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST

from .models import AdoptionSeeker, RehomeRequest, Subscriber


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


@require_POST
def submit_adoption_form(request):
    payload = {}

    if request.content_type and "application/json" in request.content_type:
        try:
            payload = json.loads(request.body.decode("utf-8"))
        except json.JSONDecodeError:
            payload = {}
    else:
        payload = request.POST.dict()

    request_type = str(payload.get("request_type", "")).strip().lower()
    full_name = str(payload.get("full_name", "")).strip()
    email = str(payload.get("email", "")).strip().lower()
    phone = str(payload.get("phone", "")).strip()
    city = str(payload.get("city", "")).strip()
    pet_type = str(payload.get("pet_type", "")).strip()
    details = str(payload.get("details", "")).strip()

    if request_type not in {"busco_adoptar", "quiero_dar_en_adopcion"}:
        return JsonResponse({"ok": False, "message": "Selecciona el tipo de solicitud."}, status=400)

    if not full_name or not email or not details:
        return JsonResponse({"ok": False, "message": "Completa nombre, correo y descripcion."}, status=400)

    if request_type == "busco_adoptar":
        AdoptionSeeker.objects.create(
            full_name=full_name,
            email=email,
            phone=phone,
            city=city,
            pet_type=pet_type,
            details=details,
        )
    else:
        RehomeRequest.objects.create(
            full_name=full_name,
            email=email,
            phone=phone,
            city=city,
            pet_type=pet_type,
            details=details,
        )

    subject = "Nueva solicitud de adopcion - Mascotia.app"
    message = (
        f"Tipo: {request_type}\n"
        f"Nombre: {full_name}\n"
        f"Correo: {email}\n"
        f"Telefono: {phone or '-'}\n"
        f"Ciudad: {city or '-'}\n"
        f"Mascota interes: {pet_type or '-'}\n\n"
        f"Detalle:\n{details}\n"
    )

    from_email = getattr(settings, "DEFAULT_FROM_EMAIL", "no-reply@mascotia.app")
    recipient = getattr(settings, "CONTACT_RECEIVER_EMAIL", "josefa@mascotia.app")

    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=from_email,
            recipient_list=[recipient],
            fail_silently=False,
        )
    except Exception:
        return JsonResponse(
            {
                "ok": False,
                "message": "La solicitud se guardo, pero no se pudo enviar el correo.",
            },
            status=500,
        )

    return JsonResponse({"ok": True, "message": "Formulario enviado correctamente."})

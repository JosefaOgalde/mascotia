import json
import csv
from pathlib import Path

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required, user_passes_test
from django.core.exceptions import ValidationError
from django.core.mail import send_mail
from django.core.validators import validate_email
from django.core.paginator import Paginator
from django.http import HttpResponseForbidden
from django.http import HttpResponse
from django.http import JsonResponse
from django.shortcuts import redirect
from django.shortcuts import render
from django.conf import settings
from django.utils import timezone
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from .models import AdoptionSeeker, RehomeRequest, Subscriber
from .security import get_client_ip, is_rate_limited


def append_adoption_row_to_sheet(row):
    export_dir = Path(settings.BASE_DIR) / "exports"
    export_dir.mkdir(parents=True, exist_ok=True)
    csv_path = export_dir / "formularios_adopcion_live.csv"

    file_exists = csv_path.exists()
    with csv_path.open("a", newline="", encoding="utf-8") as csvfile:
        writer = csv.writer(csvfile)
        if not file_exists:
            writer.writerow(
                [
                    "tipo_solicitud",
                    "nombre_completo",
                    "email",
                    "telefono",
                    "ciudad",
                    "tipo_mascota",
                    "detalle",
                ]
            )
        writer.writerow(row)


def append_newsletter_row_to_sheet(created_at, email):
    export_dir = Path(settings.BASE_DIR) / "exports"
    export_dir.mkdir(parents=True, exist_ok=True)
    csv_path = export_dir / "newsletter_live.csv"

    file_exists = csv_path.exists()
    with csv_path.open("a", newline="", encoding="utf-8") as csvfile:
        writer = csv.writer(csvfile)
        if not file_exists:
            writer.writerow(["fecha", "email"])
        writer.writerow([timezone.localtime(created_at).isoformat(), email])


def backoffice_login(request):
    if request.user.is_authenticated and request.user.is_staff:
        return redirect("backoffice_newsletter")

    error_message = ""
    if request.method == "POST":
        username = str(request.POST.get("username", "")).strip()
        password = str(request.POST.get("password", ""))
        user = authenticate(request, username=username, password=password)

        if user and user.is_active and user.is_staff:
            login(request, user)
            return redirect("backoffice_newsletter")

        error_message = "Credenciales invalidas o sin permisos de administracion."

    return render(request, "backoffice/login.html", {"error_message": error_message})


@login_required
def backoffice_logout(request):
    logout(request)
    return redirect("backoffice_login")


@login_required
@user_passes_test(lambda user: user.is_staff, login_url="backoffice_login")
def backoffice_newsletter(request):
    if not request.user.is_staff:
        return HttpResponseForbidden("No autorizado.")

    search = str(request.GET.get("q", "")).strip()
    subscribers = Subscriber.objects.all()
    if search:
        subscribers = subscribers.filter(email__icontains=search)

    paginator = Paginator(subscribers, 25)
    page_obj = paginator.get_page(request.GET.get("page"))

    return render(
        request,
        "backoffice/newsletter.html",
        {
            "search": search,
            "page_obj": page_obj,
            "total_subscribers": subscribers.count(),
        },
    )


@login_required
@user_passes_test(lambda user: user.is_staff, login_url="backoffice_login")
def backoffice_download_newsletter_csv(request):
    response = HttpResponse(content_type="text/csv; charset=utf-8")
    timestamp = timezone.localtime().strftime("%Y%m%d_%H%M%S")
    response["Content-Disposition"] = f'attachment; filename="newsletter_{timestamp}.csv"'

    writer = csv.writer(response)
    writer.writerow(["email", "fecha_registro"])
    for subscriber in Subscriber.objects.order_by("-created_at"):
        writer.writerow([subscriber.email, timezone.localtime(subscriber.created_at).isoformat()])

    return response


@login_required
@user_passes_test(lambda user: user.is_staff, login_url="backoffice_login")
def backoffice_download_adoption_csv(request):
    response = HttpResponse(content_type="text/csv; charset=utf-8")
    timestamp = timezone.localtime().strftime("%Y%m%d_%H%M%S")
    response["Content-Disposition"] = f'attachment; filename="formularios_adopcion_{timestamp}.csv"'

    writer = csv.writer(response)
    writer.writerow(
        [
            "tipo_solicitud",
            "nombre_completo",
            "email",
            "telefono",
            "ciudad",
            "tipo_mascota",
            "detalle",
            "fecha_registro",
        ]
    )

    for item in AdoptionSeeker.objects.order_by("-created_at"):
        writer.writerow(
            [
                "busco_adoptar",
                item.full_name,
                item.email,
                item.phone,
                item.city,
                item.pet_type,
                item.details,
                timezone.localtime(item.created_at).isoformat(),
            ]
        )

    for item in RehomeRequest.objects.order_by("-created_at"):
        writer.writerow(
            [
                "quiero_dar_en_adopcion",
                item.full_name,
                item.email,
                item.phone,
                item.city,
                item.pet_type,
                item.details,
                timezone.localtime(item.created_at).isoformat(),
            ]
        )

    return response


@ensure_csrf_cookie
def home(request):
    return render(request, "base.html")


@require_POST
@csrf_exempt
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

    honeypot = ""
    if request.content_type and "application/json" in request.content_type:
        honeypot = str(payload.get("website", "")).strip()
    else:
        honeypot = str(request.POST.get("website", "")).strip()

    if honeypot:
        return JsonResponse({"ok": True, "message": "Solicitud recibida."})

    if not email:
        return JsonResponse({"ok": False, "message": "Ingresa un correo valido."}, status=400)

    try:
        validate_email(email)
    except ValidationError:
        return JsonResponse({"ok": False, "message": "Ingresa un correo valido."}, status=400)

    client_ip = get_client_ip(request)
    if is_rate_limited(f"newsletter:ip:{client_ip}", limit=8, window_seconds=600):
        return JsonResponse(
            {"ok": False, "message": "Demasiados intentos. Intenta nuevamente en unos minutos."},
            status=429,
        )

    if is_rate_limited(f"newsletter:email:{email}", limit=3, window_seconds=3600):
        return JsonResponse(
            {"ok": False, "message": "Demasiados intentos para este correo. Intenta mas tarde."},
            status=429,
        )

    subscriber, created = Subscriber.objects.get_or_create(email=email)

    if not created:
        return JsonResponse(
            {
                "ok": False,
                "already_exists": True,
                "message": "Este correo ya esta registrado y no puede volver a suscribirse.",
            },
            status=409,
        )

    # Backup CSV for easy spreadsheet access from cPanel File Manager.
    try:
        append_newsletter_row_to_sheet(subscriber.created_at, subscriber.email)
    except Exception:
        pass

    return JsonResponse({"ok": True, "message": "Suscripcion realizada con exito."})


@require_POST
@csrf_exempt
def submit_adoption_form(request):
    payload = {}

    if request.content_type and "application/json" in request.content_type:
        try:
            payload = json.loads(request.body.decode("utf-8"))
        except json.JSONDecodeError:
            payload = {}
    else:
        payload = request.POST.dict()

    honeypot = str(payload.get("website", "")).strip()
    if honeypot:
        return JsonResponse({"ok": True, "message": "Solicitud recibida."})

    request_type = str(payload.get("request_type", "")).strip().lower()
    full_name = str(payload.get("full_name", "")).strip()
    email = str(payload.get("email", "")).strip().lower()
    phone = str(payload.get("phone", "")).strip()
    city = str(payload.get("city", "")).strip()
    pet_type = str(payload.get("pet_type", "")).strip()
    details = str(payload.get("details", "")).strip()

    client_ip = get_client_ip(request)
    if is_rate_limited(f"adoption:ip:{client_ip}", limit=6, window_seconds=900):
        return JsonResponse(
            {"ok": False, "message": "Demasiados envios desde tu red. Intenta en unos minutos."},
            status=429,
        )

    if request_type not in {"busco_adoptar", "quiero_dar_en_adopcion", "otro"}:
        return JsonResponse({"ok": False, "message": "Selecciona el tipo de solicitud."}, status=400)

    if not full_name or not email or not details:
        return JsonResponse({"ok": False, "message": "Completa nombre, correo y descripcion."}, status=400)

    try:
        validate_email(email)
    except ValidationError:
        return JsonResponse({"ok": False, "message": "Ingresa un correo valido."}, status=400)

    if len(details) > 3000:
        return JsonResponse({"ok": False, "message": "La descripcion es demasiado extensa."}, status=400)

    if request_type in {"busco_adoptar", "otro"}:
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

    # Backup CSV for easy spreadsheet download from cPanel File Manager.
    try:
        append_adoption_row_to_sheet(
            [request_type, full_name, email, phone, city, pet_type, details]
        )
    except Exception:
        pass

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

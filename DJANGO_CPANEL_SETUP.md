# Ejecutar Django + MySQL en cPanel

## 1) Crear app Python en cPanel

1. Ir a `Setup Python App`.
2. Crear app con:
   - Python: 3.11+ (o la version disponible compatible)
   - Application root: `public_html` (o carpeta dedicada que uses para el dominio)
   - Application URL: tu dominio `mascotia.app`
   - Startup file: `passenger_wsgi.py`
   - Application entry point: `application`

## 2) Instalar dependencias

En consola de cPanel (dentro de tu app):

```bash
pip install -r requirements.txt
```

## 3) Variables de entorno

Configura en la app Python:

- `DJANGO_SETTINGS_MODULE=mascotia_project.settings`
- `DJANGO_SECRET_KEY=...`
- `DJANGO_DEBUG=False`
- `DJANGO_ALLOWED_HOSTS=mascotia.app,www.mascotia.app`
- `MYSQL_DATABASE=newsletter`
- `MYSQL_USER=...`
- `MYSQL_PASSWORD=...`
- `MYSQL_HOST=localhost`
- `MYSQL_PORT=3306`
- `CONTACT_RECEIVER_EMAIL=josefa@mascotia.app`
- Variables SMTP (`EMAIL_HOST`, `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD`, etc.)

## 4) Migraciones y estaticos

```bash
python manage.py migrate
python manage.py collectstatic --noinput
```

## 5) Reiniciar app

En `Setup Python App`, click en `Restart`.

## 6) Verificacion

- Abre `https://mascotia.app`
- Prueba:
  - modal newsletter (debe guardar en tabla `newsletter`)
  - formulario adopcion (debe guardar en tablas `adoption_seekers` o `rehome_requests`)

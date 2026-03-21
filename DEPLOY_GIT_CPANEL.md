# Deploy con Git en cPanel

## 1) Inicializar y subir a GitHub

```bash
git add .
git commit -m "Base Django + MySQL + home responsive"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git push -u origin main
```

## 2) En cPanel: clonar repositorio

1. Ir a **Git Version Control**.
2. Elegir **Create** o **Clone Repository**.
3. Pegar URL del repo.
4. Seleccionar la ruta de clonado (por ejemplo `/home/USUARIO/repositories/mascotia`).

## 3) Publicar a `public_html`

Hay dos maneras:

- **Simple**: usar el botón **Deploy HEAD Commit** en cPanel y configurar la carpeta de despliegue.
- **Manual**: copiar archivos de build/template al destino si tu hosting no soporta app Python completa.

## 4) Variables de entorno para Django/MySQL

Configurar estas variables en el entorno de Python App de cPanel:

- `DJANGO_SECRET_KEY`
- `DJANGO_DEBUG=False`
- `DJANGO_ALLOWED_HOSTS=mascotia.app,www.mascotia.app`
- `MYSQL_DATABASE`
- `MYSQL_USER`
- `MYSQL_PASSWORD`
- `MYSQL_HOST`
- `MYSQL_PORT`

## 5) Comandos en servidor (Terminal cPanel)

```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
```

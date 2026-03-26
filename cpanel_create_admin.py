import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mascotia_project.settings")

import django


def upsert_admin_user(user_model, username, password, email):
    user, created = user_model.objects.get_or_create(username=username, defaults={"email": email})
    user.email = email or user.email
    user.is_staff = True
    user.is_superuser = True
    user.is_active = True
    user.set_password(password)
    user.save()
    action = "creado" if created else "actualizado"
    print(f"Usuario administrador {action}: {username}")


def main():
    django.setup()

    from django.contrib.auth import get_user_model

    username = os.getenv("DJANGO_ADMIN_USERNAME", "adminfix").strip()
    second_username = os.getenv("DJANGO_SECOND_ADMIN_USERNAME", "").strip()
    password = os.getenv("DJANGO_ADMIN_PASSWORD", "Mascotia1234").strip()
    email = os.getenv("DJANGO_ADMIN_EMAIL", "adminfix@mascotia.app").strip()

    if not username or not password:
        raise SystemExit("Debes definir DJANGO_ADMIN_USERNAME y DJANGO_ADMIN_PASSWORD.")

    User = get_user_model()
    usernames = [username]
    if second_username and second_username not in usernames:
        usernames.append(second_username)

    for target_username in usernames:
        upsert_admin_user(User, target_username, password, email)


if __name__ == "__main__":
    main()

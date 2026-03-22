import csv
import os
from datetime import datetime
from pathlib import Path

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mascotia_project.settings")

import django

django.setup()

from core.models import Subscriber  # noqa: E402


def main():
    export_dir = Path(__file__).resolve().parent / "exports"
    export_dir.mkdir(parents=True, exist_ok=True)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_path = export_dir / f"newsletter_subscribers_{timestamp}.csv"

    rows = Subscriber.objects.order_by("-created_at").values_list("email", "created_at")

    with output_path.open("w", newline="", encoding="utf-8") as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(["email", "created_at"])
        for email, created_at in rows:
            writer.writerow([email, created_at.isoformat() if created_at else ""])

    print(f"OK: archivo generado en {output_path}")
    print(f"TOTAL: {Subscriber.objects.count()} correos exportados")


if __name__ == "__main__":
    main()

import csv
import os
from datetime import datetime
from pathlib import Path

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mascotia_project.settings")

import django

django.setup()

from core.models import AdoptionSeeker, RehomeRequest  # noqa: E402


def main():
    export_dir = Path(__file__).resolve().parent / "exports"
    export_dir.mkdir(parents=True, exist_ok=True)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_path = export_dir / f"formularios_adopcion_{timestamp}.csv"

    seekers = AdoptionSeeker.objects.order_by("-created_at")
    rehomes = RehomeRequest.objects.order_by("-created_at")

    with output_path.open("w", newline="", encoding="utf-8") as csvfile:
        writer = csv.writer(csvfile)
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

        for item in seekers:
            writer.writerow(
                [
                    "busco_adoptar",
                    item.full_name,
                    item.email,
                    item.phone,
                    item.city,
                    item.pet_type,
                    item.details,
                    item.created_at.isoformat() if item.created_at else "",
                ]
            )

        for item in rehomes:
            writer.writerow(
                [
                    "quiero_dar_en_adopcion",
                    item.full_name,
                    item.email,
                    item.phone,
                    item.city,
                    item.pet_type,
                    item.details,
                    item.created_at.isoformat() if item.created_at else "",
                ]
            )

    total = seekers.count() + rehomes.count()
    print(f"OK: archivo generado en {output_path}")
    print(f"TOTAL: {total} formularios exportados")


if __name__ == "__main__":
    main()

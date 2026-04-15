from django.contrib import admin

from .models import AdoptionSeeker, RehomeRequest


@admin.register(AdoptionSeeker)
class AdoptionSeekerAdmin(admin.ModelAdmin):
    list_display = ("full_name", "email", "pet_type", "city", "created_at")
    search_fields = ("full_name", "email", "pet_type", "city")


@admin.register(RehomeRequest)
class RehomeRequestAdmin(admin.ModelAdmin):
    list_display = ("full_name", "email", "pet_type", "city", "created_at")
    search_fields = ("full_name", "email", "pet_type", "city")

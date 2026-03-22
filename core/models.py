from django.db import models


class Subscriber(models.Model):
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        db_table = "newsletter"

    def __str__(self):
        return self.email


class AdoptionSeeker(models.Model):
    full_name = models.CharField(max_length=120)
    email = models.EmailField()
    phone = models.CharField(max_length=40, blank=True)
    city = models.CharField(max_length=120, blank=True)
    pet_type = models.CharField(max_length=120, blank=True)
    details = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        db_table = "adoption_seekers"

    def __str__(self):
        return f"{self.full_name} ({self.email})"


class RehomeRequest(models.Model):
    full_name = models.CharField(max_length=120)
    email = models.EmailField()
    phone = models.CharField(max_length=40, blank=True)
    city = models.CharField(max_length=120, blank=True)
    pet_type = models.CharField(max_length=120, blank=True)
    details = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        db_table = "rehome_requests"

    def __str__(self):
        return f"{self.full_name} ({self.email})"

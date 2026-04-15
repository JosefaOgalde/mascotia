import json

from django.test import TestCase
from django.urls import reverse

from .models import Subscriber


class NewsletterSubscriptionTests(TestCase):
    def test_subscribe_accepts_form_encoded_payload(self):
        response = self.client.post(
            reverse("subscribe_newsletter"),
            data={"email": "formulario@example.com", "website": ""},
        )

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json().get("ok"))
        self.assertEqual(Subscriber.objects.filter(email="formulario@example.com").count(), 1)

    def test_subscribe_creates_subscriber(self):
        response = self.client.post(
            reverse("subscribe_newsletter"),
            data=json.dumps({"email": "persona@example.com", "website": ""}),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json().get("ok"))
        self.assertEqual(Subscriber.objects.filter(email="persona@example.com").count(), 1)

    def test_subscribe_duplicate_email_returns_conflict_and_keeps_single_row(self):
        Subscriber.objects.create(email="persona@example.com")

        response = self.client.post(
            reverse("subscribe_newsletter"),
            data=json.dumps({"email": "persona@example.com", "website": ""}),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 409)
        body = response.json()
        self.assertFalse(body.get("ok"))
        self.assertTrue(body.get("already_exists"))
        self.assertEqual(Subscriber.objects.filter(email="persona@example.com").count(), 1)

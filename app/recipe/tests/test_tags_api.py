"""
Test for the tags API endpoints.
"""

from typing import Any, Dict

from core.models import Tag
from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from recipe.serializers import TagSerializer
from rest_framework import status
from rest_framework.test import APIClient

TAGS_URL = reverse("recipe:tag-list")


def detail_url(tag_id: int) -> str:
    """Create and return a tag detail URL."""
    return reverse("recipe:tag-detail", args=[tag_id])


def create_user(email: str = "user@example.com", password: str = "testpass123") -> Any:
    """Helper function to create a new user."""
    return get_user_model().objects.create_user(email=email, password=password)


class PublicTagsApiTests(TestCase):
    """Tests for unauthenticated API access to tags."""

    def setUp(self) -> None:
        self.client = APIClient()

    def test_login_required(self) -> None:
        """Test auth is required for retrieving tags."""
        res = self.client.get(TAGS_URL)

        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


class PrivateTagsApiTests(TestCase):
    """Test authenticated API requests."""

    def setUp(self) -> None:
        self.user = create_user()
        self.client = APIClient()
        self.client.force_authenticate(self.user)  # type: ignore[attr-defined]

    def test_retrieve_tags(self) -> None:
        """Test retrieving tags."""
        Tag.objects.create(user=self.user, name="Vegan")
        Tag.objects.create(user=self.user, name="Dessert")

        res = self.client.get(TAGS_URL)

        tags = Tag.objects.all().order_by("-name")
        serializer = TagSerializer(tags, many=True)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn("count", res.data)  # type: ignore[attr-defined]
        self.assertIn("next", res.data)  # type: ignore[attr-defined]
        self.assertIn("previous", res.data)  # type: ignore[attr-defined]
        self.assertEqual(res.data["count"], tags.count())  # type: ignore[index]
        self.assertEqual(  # type: ignore[index]
            res.data["results"],
            serializer.data,
        )

    def test_tags_limited_to_user(self) -> None:
        """Test list of tags is limited to authenticated user."""
        user2 = create_user(email="user2@example.com")
        Tag.objects.create(user=user2, name="Fruity")
        tag = Tag.objects.create(user=self.user, name="Comfort Food")

        res = self.client.get(TAGS_URL)
        data: Dict[str, Any] = res.data  # type: ignore[attr-defined]

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(data["count"], 1)
        self.assertEqual(len(data["results"]), 1)
        self.assertEqual(data["results"][0]["name"], tag.name)
        self.assertEqual(data["results"][0]["id"], tag.id)

    def test_update_tag(self) -> None:
        """Test updating a tag."""
        tag = Tag.objects.create(user=self.user, name="After Dinner")

        payload = {"name": "Dessert"}
        url = detail_url(tag.id)
        res = self.client.patch(url, payload)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        tag.refresh_from_db()
        self.assertEqual(tag.name, payload["name"])

    def test_delete_tag(self) -> None:
        """Test deleting a tag."""
        tag = Tag.objects.create(user=self.user, name="Breakfast")
        tag_id = tag.id

        url = detail_url(tag_id)
        res = self.client.delete(url)

        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Tag.objects.filter(id=tag_id).exists())

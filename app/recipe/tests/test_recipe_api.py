"""
Tests for recipe API endpoints.
"""

from decimal import Decimal
from typing import Any, Dict

from core.models import Recipe, Tag
from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from recipe.serializers import RecipeDetailSerializer, RecipeSerializer
from rest_framework import status
from rest_framework.test import APIClient

RECIPES_URL = reverse("recipe:recipe-list")


def detail_url(recipe_id: int) -> str:
    """Create and return a recipe detail URL."""
    return reverse("recipe:recipe-detail", args=[recipe_id])


def create_recipe(user: Any, **params: Any) -> Recipe:
    """Create and return a sample recipe."""
    defaults = {
        "title": "Sample recipe",
        "time_minutes": 22,
        "price": Decimal("5.25"),
        "description": "Sample description",
        "link": "http://example.com/recipe.pdf",
    }
    defaults.update(params)

    recipe = Recipe.objects.create(user=user, **defaults)
    return recipe


def create_user(**params: Any) -> Any:
    """Create and return a new user."""
    return get_user_model().objects.create_user(**params)


class PublicRecipeApiTests(TestCase):
    """Test unauthenticated recipe API access."""

    def setUp(self) -> None:
        self.client = APIClient()

    def test_auth_required(self) -> None:
        """Test auth is required to call API."""
        res = self.client.get(RECIPES_URL)

        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


class PrivateRecipeApiTests(TestCase):
    """Test authenticated API requests."""

    def setUp(self) -> None:
        self.client = APIClient()
        self.user = create_user(email="user@example.com", password="testpass123")
        self.client.force_authenticate(self.user)  # type: ignore[attr-defined]

    def test_retrieve_recipes(self) -> None:
        """Test retrieving a list of recipes."""
        create_recipe(user=self.user)
        create_recipe(user=self.user)

        res = self.client.get(RECIPES_URL)

        recipes = Recipe.objects.all().order_by("-id")
        serializer = RecipeSerializer(recipes, many=True)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)  # type: ignore[attr-defined]

    def test_recipe_list_limited_to_user(self) -> None:
        """
        Test list of recipes is
        limited to authenticated user.
        """
        other_user = create_user(email="other@example.com", password="password123")
        create_recipe(user=other_user)
        create_recipe(user=self.user)

        res = self.client.get(RECIPES_URL)

        recipes = Recipe.objects.filter(user=self.user)
        serializer = RecipeSerializer(recipes, many=True)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)  # type: ignore[attr-defined]

    def test_get_recipe_detail(self) -> None:
        """Test get recipe detail."""
        recipe = create_recipe(user=self.user)

        url = detail_url(recipe.id)
        res = self.client.get(url)

        serializer = RecipeDetailSerializer(recipe)
        self.assertEqual(res.data, serializer.data)  # type: ignore[attr-defined]

    def test_create_recipe(self) -> None:
        """Test creating a recipe."""
        payload = {
            "title": "Chocolate cheesecake",
            "time_minutes": 30,
            "price": Decimal("5.99"),
            "description": "Delicious chocolate cheesecake recipe",
            "link": "http://example.com/chocolate_cheesecake.pdf",
        }
        res = self.client.post(RECIPES_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        data: Dict[str, Any] = res.data  # type: ignore[attr-defined]
        recipe = Recipe.objects.get(id=data["id"])
        for k, v in payload.items():
            self.assertEqual(getattr(recipe, k), v)
        self.assertEqual(recipe.user, self.user)

    def test_partial_update(self) -> None:
        """Test partial update of a recipe."""
        original_link = "http://example.com/recipe.pdf"
        recipe = create_recipe(
            user=self.user,
            title="Sample recipe title",
            link=original_link,
        )

        payload = {"title": "New recipe title"}
        url = detail_url(recipe.id)
        res = self.client.patch(url, payload)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        recipe.refresh_from_db()
        self.assertEqual(recipe.title, payload["title"])
        self.assertEqual(recipe.link, original_link)
        self.assertEqual(recipe.user, self.user)

    def test_full_update(self) -> None:
        """Test full update of recipe."""
        recipe = create_recipe(
            user=self.user,
            title="Sample recipe title",
            link="http://example.com/recipe.pdf",
            description="Sample description",
        )

        payload = {
            "title": "New recipe title",
            "time_minutes": 10,
            "price": Decimal("2.50"),
            "description": "New recipe description",
            "link": "http://example.com/new-recipe.pdf",
        }
        url = detail_url(recipe.id)
        res = self.client.put(url, payload)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        recipe.refresh_from_db()
        for k, v in payload.items():
            self.assertEqual(getattr(recipe, k), v)
        self.assertEqual(recipe.user, self.user)

    def test_update_user_returns_error(self) -> None:
        """
        Test changing the recipe
        user resulsts in an error.
        """
        new_user = create_user(email="user2@example.com", password="testpass123")
        recipe = create_recipe(user=self.user)

        payload = {"user": new_user.id}
        url = detail_url(recipe.id)
        self.client.patch(url, payload)

        recipe.refresh_from_db()
        self.assertEqual(recipe.user, self.user)

    def test_delete_recipe(self) -> None:
        """Test deleting a recipe successful."""
        recipe = create_recipe(user=self.user)

        url = detail_url(recipe.id)
        res = self.client.delete(url)

        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Recipe.objects.filter(id=recipe.id).exists())

    def test_delete_other_users_recipe_error(self) -> None:
        """
        Test trying to delete another
        users recipe gives error.
        """
        new_user = create_user(email="user2@example.com", password="testpass123")
        recipe = create_recipe(user=new_user)

        url = detail_url(recipe.id)
        res = self.client.delete(url)

        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)
        self.assertTrue(Recipe.objects.filter(id=recipe.id).exists())

    def test_create_recipe_with_new_tags(self) -> None:
        """Test creating a recipe with new tags."""
        payload = {
            "title": "Thai Prawn Curry",
            "time_minutes": 30,
            "price": Decimal("2.50"),
            "tags": [{"name": "Thai"}, {"name": "Dinner"}],
        }
        res = self.client.post(RECIPES_URL, payload, format="json")

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        recipes = Recipe.objects.filter(user=self.user)
        self.assertEqual(recipes.count(), 1)
        recipe = recipes[0]
        self.assertEqual(recipe.tags.count(), 2)
        tags_payload: Any = payload["tags"]
        for tag in tags_payload:
            exists = recipe.tags.filter(
                name=tag["name"],
                user=self.user,
            ).exists()
            self.assertTrue(exists)

    def test_create_recipe_with_existing_tags(self) -> None:
        """Test creating a recipe with existing tag."""
        tag_indian = Tag.objects.create(user=self.user, name="Indian")
        payload = {
            "title": "Pongal",
            "time_minutes": 60,
            "price": Decimal("4.50"),
            "tags": [{"name": "Indian"}, {"name": "Breakfast"}],
        }
        res = self.client.post(RECIPES_URL, payload, format="json")

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        recipes = Recipe.objects.filter(user=self.user)
        self.assertEqual(recipes.count(), 1)
        recipe = recipes[0]
        self.assertEqual(recipe.tags.count(), 2)
        self.assertIn(tag_indian, recipe.tags.all())
        tags_payload: Any = payload["tags"]
        for tag in tags_payload:
            exists = recipe.tags.filter(
                name=tag["name"],
                user=self.user,
            ).exists()
            self.assertTrue(exists)

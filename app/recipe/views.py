# mypy: ignore-errors
"""
Views for the recipe APIs.
"""

from typing import Any

from core.models import Recipe, Tag
from recipe import serializers
from rest_framework import mixins, viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated


class RecipeViewSet(viewsets.ModelViewSet[Recipe]):  # type: ignore[misc]
    """View for manage recipe APIs."""

    serializer_class = serializers.RecipeSerializer
    queryset = Recipe.objects.all()
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get_queryset(self) -> Any:
        """Return recipes for the authenticated user only."""
        return self.queryset.filter(user=self.request.user).order_by("-id")

    def get_serializer_class(self) -> Any:
        """Return appropriate serializer class."""
        if self.action == "list":
            return serializers.RecipeDetailSerializer

        return self.serializer_class

    def perform_create(self, serializer: serializers.RecipeSerializer) -> None:
        """Create a new recipe."""
        serializer.save(user=self.request.user)


class TagViewSet(
    mixins.DestroyModelMixin,
    mixins.UpdateModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):  # type: ignore
    """Manage tags in the database."""

    serializer_class = serializers.TagSerializer
    queryset = Tag.objects.all()
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get_queryset(self) -> Any:
        """Return tags for the authenticated user only."""
        return self.queryset.filter(user=self.request.user).order_by("-name")

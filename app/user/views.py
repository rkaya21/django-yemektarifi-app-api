"""
Views for user API.
"""

from typing import Any

from rest_framework import authentication, generics, permissions, throttling
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.settings import api_settings
from user.serializers import AuthTokenSerializer, UserSerializer


class CreateUserView(generics.CreateAPIView):  # type: ignore[misc]
    """Create new user."""

    serializer_class = UserSerializer


class CreateTokenView(ObtainAuthToken):  # type: ignore[misc]
    """Create a new auth token."""

    serializer_class = AuthTokenSerializer
    renderer_classes = api_settings.DEFAULT_RENDERER_CLASSES
    throttle_classes = [throttling.AnonRateThrottle]


class ManageUserView(generics.RetrieveUpdateAPIView):  # type: ignore[misc]
    """
    Manage the authenticated user.
    """

    serializer_class = UserSerializer
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self) -> Any:
        """
        Retrieve and return the authenticated user.
        """
        return self.request.user

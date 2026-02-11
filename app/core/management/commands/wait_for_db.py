"""
Command in Django to pause until the database is accessible
"""

import time
from typing import Any

from django.core.management.base import BaseCommand
from django.db.utils import OperationalError
from psycopg2 import OperationalError as Psycopg2Error


class Command(BaseCommand):
    """Django command to wait for database."""

    def handle(self, *args: Any, **options: Any) -> None:
        """Entrypoint for command."""
        self.stdout.write("Waiting for Database")
        db_up = False
        while db_up is False:
            try:
                self.check(databases=["default"])
                db_up = True
            except (Psycopg2Error, OperationalError):
                self.stdout.write("Database unavailable, waiting 1 seconds.")
                time.sleep(1)
        self.stdout.write(self.style.SUCCESS("Database available"))

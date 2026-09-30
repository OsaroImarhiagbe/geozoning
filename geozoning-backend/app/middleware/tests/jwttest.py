from uuid import uuid4

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.middleware.jwt import create_access_token


@pytest.fixture
def client():
    """
    Test client for FastAPI app
    """
    return TestClient(app)

@pytest.fixture
def normal_user_token():
    """
    Create a token for normal user
    """
    return create_access_token(
        subject=uuid4(),
        roles="user"
    )

# @pytest.fixture
# def admin_user_token():
#     """
#     Create a token for admin user
#     """
#     return create_access_token(
#         subject="admin@example.com",
#         roles=["user", "admin"]
#     )
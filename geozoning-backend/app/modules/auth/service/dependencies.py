from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.infrastructure.db.dependecies import get_db
from app.modules.auth.infrastructure.auth_dal.auth_dal import AuthRepositories
from app.modules.auth.service.auth_service import AuthService

get_database_dependency = Annotated[AsyncSession,Depends(get_db)]


def get_auth_service(db: get_database_dependency) -> AuthService :
    repo = AuthRepositories(db)
    auth_service = AuthService(repo)
    return auth_service

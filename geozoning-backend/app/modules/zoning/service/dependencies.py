from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.infrastructure.db.dependecies import get_db
from app.modules.zoning.infrastructure.zoning_dal.zoning_dal import ZoningRepository
from app.modules.zoning.service.zoning_service import ZoningService

get_database_dependency = Annotated[AsyncSession,Depends(get_db)]


def get_zoning_service(db: get_database_dependency) -> ZoningService:
    repo = ZoningRepository(db)
    zoning_service = ZoningService(repo)
    return zoning_service

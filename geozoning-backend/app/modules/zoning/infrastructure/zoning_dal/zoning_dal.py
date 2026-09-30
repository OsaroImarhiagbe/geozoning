from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from geoalchemy2.functions import ST_Intersects, ST_MakeEnvelope
from app.modules.zoning.infrastructure.models.zoning_parcels import Parcels


class ZoningRepository:
    def __init__(self, db: AsyncSession):
        self.__db = db

    async def find_parcels_by_bbox(
        self,
        min_lng: float,
        min_lat: float,
        max_lng: float,
        max_lat: float,
    ) -> list[Parcels]:
        
        # Construct the viewport rectangle from the four coordinates
        viewport = ST_MakeEnvelope(min_lng, min_lat, max_lng, max_lat, 4326)

        stmt = (
            select(Parcels)
            .where(ST_Intersects(Parcels.geometry, viewport))
        )

        result = await self.__db.execute(stmt)
        return result.scalars().all()
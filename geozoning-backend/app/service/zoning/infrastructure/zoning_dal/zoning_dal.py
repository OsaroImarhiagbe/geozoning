from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from geoalchemy2.functions import ST_Intersects, ST_MakeEnvelope
from app.service.zoning.infrastructure.models.zoning_parcels_table import Zoning_Parcels_Table


class ZoningRepository:
    def __init__(self, db: AsyncSession):
        self.__db = db

    async def find_parcels_by_bbox(
        self,
        min_lng: float,
        min_lat: float,
        max_lng: float,
        max_lat: float,
    ):
        
        # Construct the viewport rectangle from the four coordinates
        viewport = ST_MakeEnvelope(min_lng, min_lat, max_lng, max_lat, 4326)

        stmt = (
            select(Zoning_Parcels_Table)
            .where(ST_Intersects(Zoning_Parcels_Table.geometry, viewport))
        )

        result = await self.__db.execute(stmt)
        return result.scalars().all()
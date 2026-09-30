from app.modules.zoning.infrastructure.zoning_dal.zoning_dal import ZoningRepository
from app.modules.zoning.schemas.zoning_schema import ZoningQuery
class ZoningService:
    """
    Service handles zoning for the AOI
    """

    def __init__(self,repo: ZoningRepository):
        self.__repo = repo

    async def zones(self,min_lng: float,min_lat: float,max_lng: float,max_lat: float):
        """
        Service Layer Function for grabbing parcels based off the bounding box
        """
        self.__repo.find_parcels_by_bbox(min_lng=min_lng,min_lat=min_lat,max_lng=max_lng,max_lat=max_lat)
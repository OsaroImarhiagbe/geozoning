from fastapi import APIRouter, Depends, HTTPException, Request, Response, status, Query
from typing import Annotated
from app.modules.zoning.schemas.zoning_schema import ZoningQuery
from app.modules.zoning.service.zoning_service import ZoningService
from app.modules.zoning.service.dependencies import get_zoning_service
router = APIRouter(tags=["zoning"])

#`GET /api/zoning/parcels?min_lng=-77.12&min_lat=38.78&max_lng=-77.01&max_lat=38.85`
## client is passing current mapbox bounding arrays as parameters
# What the response looks like {
###"type": "FeatureCollection",
'''"features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [[...]]
      },
      "properties": {
        "parcel_id": "123abc",
        "zone_code": "CC",
        "description": "Commercial Community"
      }
    }
  ]
}'''



# To Do: Finish out refresh token endpoint and register user endpoint


get_zoning_service_dependency = Annotated[ZoningService, Depends(get_zoning_service)]
@router.get('/parcels',tags=['zoning'])
async def get_zones(service: get_zoning_service_dependency, filter_query: Annotated[ZoningQuery, Query()]):
    """
    Endpoint is getting parcels zones based on bounding area
    """
    return await service.zones(min_lng=filter_query.min_lng,min_lat=filter_query.min_lat,max_lng=filter_query.max_lng,max_lat=filter_query.max_lat)
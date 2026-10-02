from pydantic import BaseModel
from typing import Literal
from pydantic import BaseModel

class ZoningQuery(BaseModel):
    min_lng: float
    min_lat: float
    max_lng: float
    max_lat: float



class ParcelGeometry(BaseModel):
    type: Literal["Polygon"]
    coordinates: list[list[list[float]]]  # [[[lng, lat], [lng, lat], ...]]


class ParcelProperties(BaseModel):
    pid: int
    address: str
    zone_code: str
    land_desc: str
    land_sf: float


class ParcelFeature(BaseModel):
    type: Literal["Feature"]
    geometry: ParcelGeometry
    properties: ParcelProperties


class ParcelFeatureCollection(BaseModel):
    type: Literal["FeatureCollection"]
    features: list[ParcelFeature]

class ParcelResponse(BaseModel):
    status:int
    error:str | None = None
    data: ParcelFeatureCollection
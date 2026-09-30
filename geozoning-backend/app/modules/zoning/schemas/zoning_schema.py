from pydantic import BaseModel

class ZoningQuery(BaseModel):
    min_lng: float
    min_lat: float
    max_lng: float
    max_lat: float
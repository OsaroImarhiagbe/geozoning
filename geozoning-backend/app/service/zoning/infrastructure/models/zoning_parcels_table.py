from datetime import datetime
from uuid import UUID
from sqlalchemy import DateTime, String, func, Float
from sqlalchemy.orm import Mapped, mapped_column
from geoalchemy2 import Geometry
from app.infrastructure.db.base_models.base import Base


class Zoning_Parcels_Table(Base):

    __tablename__ = "zoning_parcels"

    id:Mapped[UUID] = mapped_column(primary_key=True, index=True,unique=True,server_default=func.gen_random_uuid(),comment="Id of parcel") ## this is using v4 uuid

    pid:Mapped[str] = mapped_column(String(100),unique=True,nullable=True,comment="parcel id")

    map:Mapped[str] = mapped_column(String(100),nullable=True, comment="map")

    block:Mapped[str] = mapped_column(String(100),nullable=True,unique=False, comment="block")

    lot_gis:Mapped[str] = mapped_column( String(100),unique=False,nullable=True, comment="parcel lot gis")

    lot_re:Mapped[str] = mapped_column(String(100),unique=False, nullable=True, comment="parcel lot")

    account_number:Mapped[str] = mapped_column(String(100),unique=False,nullable=True,comment="parcel account number") 

    address:Mapped[str] = mapped_column(String(100),unique=False,nullable=True, comment="address")

    st_num:Mapped[str] = mapped_column(String(100),unique=True, nullable=True, comment="parcel st num")

    st_alpha:Mapped[str] = mapped_column(String(100),unique=False,nullable=True, comment="st_aplha")

    st_name:Mapped[str] = mapped_column(String(100), unique=False, nullable=True, comment="st_name")

    st_type:Mapped[str] = mapped_column(String(100), unique=False, nullable=True, comment="st_type")

    unit:Mapped[str] = mapped_column(String(100),unique=False, nullable=True, comment="unit")

    plat:Mapped[str] = mapped_column(String(100), unique=False, nullable=True,comment="plat")

    legal_lot:Mapped[str] = mapped_column(String(100),unique=False,nullable=True, comment="legal lot")

    status:Mapped[str] = mapped_column(String(100),unique=False, nullable=True, comment="status")

    land_code:Mapped[str] = mapped_column(String(100),unique=False, nullable=True,comment="land code")

    land_desc:Mapped[str] = mapped_column(String(100),nullable=True,comment="Description of land")

    prp_name:Mapped[str] = mapped_column(String(100),unique=False, nullable=True, comment="prp name")

    zone_code:Mapped[str] = mapped_column(String(30),nullable=True,comment="zoning code")

    neighborho:Mapped[str] = mapped_column(String(100),unique=False, nullable=True, comment="neighborhood")
    
    land_sf:Mapped[float] = mapped_column(Float,nullable=True,comment="Land Sf")

    own_name:Mapped[str] = mapped_column(String(100),unique=False, nullable=True,comment="owner name")

    owner_name_2:Mapped[str] = mapped_column(String(100),unique=False, nullable=True,comment="owner name version 2")

    own_add:Mapped[str] = mapped_column(String(100),unique=False, nullable=True, comment="owner address")

    own_add_2:Mapped[str] = mapped_column(String(100),unique=False, nullable=True, comment="owner address version 2")

    own_city:Mapped[str] = mapped_column(String(100),unique=False, nullable=True, comment="owner city")

    own_stat:Mapped[str] = mapped_column(String(100),unique=False, nullable=True, comment="owner stat")

    own_zip:Mapped[str] = mapped_column(String(100),unique=False, nullable=True, comment="owner zip")

    instrument:Mapped[str] = mapped_column(String(100),unique=False, nullable=True,comment="instrument")

    geometry:Mapped[Geometry] = mapped_column(Geometry(geometry_type="MULTIPOLYGON", srid=4326),comment="polygon geometry")

    shape_area:Mapped[float] = mapped_column(Float, unique=False, nullable=True,comment="shape area")

    shape_length:Mapped[float] = mapped_column(Float, unique=False, nullable=True,comment="shape length")

    created_at:Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(),doc="Create At",comment="When the user was first created")

    updated_at:Mapped[datetime] = mapped_column(DateTime(timezone=True),server_default=func.now(),server_onupdate=func.now(),doc="Updated At",comment="When the user was updated")

    last_synced:Mapped[datetime] = mapped_column(DateTime(timezone=True),server_default=func.now(),server_onupdate=func.now(),doc="Last Login",comment="User's last login attempt")
from datetime import datetime
from uuid import UUID

from sqlalchemy import Boolean, DateTime, String, func,Float
from sqlalchemy.orm import Mapped, mapped_column
from geoalchemy2 import Geometry
from app.modules.models.base import Base


class Parcels(Base):

    __tablename__ = "parcels"

    id:Mapped[UUID] = mapped_column(
        primary_key=True, 
        index=True,
        unique=True,
        server_default=func.uuid7(),
        comment="Id of parcel") ## this is using v4 uuid
    
    pid:Mapped[int] = mapped_column(
        unique=True,
        comment="parcel id")
    
    address:Mapped[String] = mapped_column(
        unique=True,
        nullable=False
    )
    zone_code:Mapped[String] = mapped_column(
        nullable=False,
        comment="zoning code"
    )

    land_desc:Mapped[String] = mapped_column(
        nullable=False,
        comment="Description of land"
    )
    land_sf:Mapped[Float] = mapped_column(
        nullable=False,
        comment="Land Sf"
    )
    geometry:Mapped[Geometry] = mapped_column(
        Geometry(geometry_type="POLYGON", srid=4326)
    )
    created_at:Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        server_default=func.now(),
        doc="Create At",
        comment="When the user was first created")

    updated_at:Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        server_onupdate=func.now(),
        doc="Updated At",
        comment="When the user was updated")

    last_synced:Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        server_onupdate=func.now(),
        doc="Last Login",
        comment="User's last login attempt")
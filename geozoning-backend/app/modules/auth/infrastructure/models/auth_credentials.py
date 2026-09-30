from datetime import datetime
from uuid import UUID

from sqlalchemy import Boolean, DateTime, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.modules.auth.schemas.auth import Email_Verified, Role
from app.modules.models.base import Base


class Auth_Credentials(Base):

    __tablename__ = "auth_credentials"

    user_id:Mapped[UUID] = mapped_column(
        primary_key=True, 
        index=True,
        unique=True,
        server_default=func.uuid7(),
        doc="Auth ID",
        comment="Id of the user") ## this is using v4 uuid

    email:Mapped[str] = mapped_column(
        String(30),unique=True,
        nullable=False,
        doc="Email",
        comment="The email of the user")

    hashed_password:Mapped[str] = mapped_column(
        String(100),unique=True,
        nullable=False,
        doc="Password",
        comment="User's password")

    email_verified:Mapped[bool] = mapped_column(
        Boolean,
        server_default= str(Email_Verified.not_verified.value).lower(),
        nullable=False)

    role:Mapped[str] = mapped_column(
        String(10),
        server_default=Role.USER.value,
        nullable=False,
        doc="Role",
        comment="The role of the user")
    
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

    last_login:Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        server_onupdate=func.now(),
        doc="Last Login",
        comment="User's last login attempt")
from enum import Enum
from uuid import UUID

from pydantic import BaseModel, EmailStr, SecretStr


# User Authentication Role
class Role(Enum):
    ADMIN = 'admin'
    USER = 'user'
    GUEST = 'guest'

# User Email verification Value
class Email_Verified(Enum):
    is_verified = True
    not_verified = False

# Auth Request Object
class RefreshRequest(BaseModel):
    user_id:UUID
    roles:str

class RefreshResponse(BaseModel):
    access_token:str

class LoginRequest(BaseModel):
    name:str
    email: EmailStr
    password:SecretStr

class RegisterRequest(BaseModel):
    name:str
    email:str
    password:SecretStr


# Authentication Response Object
class UserAuthenticationData(BaseModel):
    user_id:UUID
    email:EmailStr

class Token(BaseModel):
    access_token: str
    refresh_token:str
    user:UserAuthenticationData

class TokenResponse(BaseModel):
    status:int
    error:str | None = None
    data: Token

class TokenPayload(BaseModel):
    sub: str | None = None
    exp: int | None = None
    roles: list[str] = []

class TokenData(BaseModel):
    username: str | None = None


class RefreshTokenRespone(BaseModel):
    access_token:str
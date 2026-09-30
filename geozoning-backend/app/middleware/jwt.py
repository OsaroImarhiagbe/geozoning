from datetime import UTC, datetime, timedelta
from typing import Any
from uuid import uuid4

from jose import jwt

from app.core.config import settings


def create_access_token(subject: str,role:str,email_verified:bool,expires_delta: timedelta | None = None) -> str:
    """ Creates JWT Access Token"""

    if expires_delta:
        expire = datetime.now(UTC) + expires_delta
    else:
        expire = datetime.now(UTC) + timedelta(minutes=settings.access_token_expire_minutes)

    to_encode = {
        "sub":str(subject),
        "email_verified":email_verified,
        "iss":"https://yourdomain.com", # We will figure out how to add the iss later and aud
        "role":role,
        "iat":datetime.now(UTC),
        "exp":expire,
    }

    ## Creating and Signing access token
    encode_jwt = jwt.encode(
        to_encode,
        settings.secret_key.get_secret_value(), 
        algorithm=settings.algorithm.get_secret_value()
    )

    return encode_jwt

def create_refresh_token(subject:str,ver:int) -> str:
    """ Create JWT refresh token"""

    expire = datetime.now(UTC) + timedelta(days=settings.refresh_token_expire_days)

    to_encode = {
        "sub":str(subject),
        "ver":ver,
        "jti":str(uuid4()),
        "iss":"https://yourdomain.com",
        "iat":datetime.now(UTC),
        "exp":expire,
    }

    encode_jwt = jwt.encode(
        to_encode, 
        settings.secret_key.get_secret_value(), 
        algorithm=settings.algorithm.get_secret_value()
    )

    return encode_jwt
    

def decode_token(token:str) -> dict[str,Any]:
    """ Decode JWT token to verify it"""
    payload = jwt.decode(token, settings.secret_key, algorithms=settings.algorithm)
    if not payload:
        raise ValueError("Invalid token!")
        
    return payload
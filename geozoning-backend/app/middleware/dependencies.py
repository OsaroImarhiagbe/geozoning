from datetime import datetime

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from pydantic import ValidationError

from app.core.config import settings
from app.middleware.jwt import decode_token
from app.modules.auth.schemas.auth import TokenPayload

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.api_v1_str}/auth/login")

## this function will be our token validation function
async def get_current_user(token:str = Depends(oauth2_scheme)):
    """ Validate tokens and return username"""
    try:
        payload = decode_token(token)

        # if invalid token
        if not payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
                headers={"WWW-Authenticate": "Bearer"}
            )
        # Check for token expiration
        if datetime.fromtimestamp(payload.exp) < datetime.now():
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail='Token Expired',
                headers={"WWW-Authenticate": "Bearer"}
            )
        
        return payload
    except (JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
async def get_current_user_id(current_user = Depends(get_current_user)) -> str:
    return str(current_user['sub'])

def get_current_user_with_roles(required_roles:list[str] | None = None) -> callable:
    """
    Creates a dependency that checks if the current user has the required roles
    """
    if required_roles is None:
        required_roles = []
    ## privatr function
    def _inner(token: str = Depends(oauth2_scheme)) -> str:
        try:
            payload = decode_token(token)
            token_data = TokenPayload(**payload)
            # Check token expiration
            if datetime.fromtimestamp(token_data.exp) < datetime.now():
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Token expired",
                    headers={"WWW-Authenticate": "Bearer"},
                )
            # If no specific roles required, just authentication is enough
            if not required_roles:
                return token_data.sub
            # Check if user has at least one of the required roles
            user_roles = set(token_data.roles)
            if not any(role in user_roles for role in required_roles) and "admin" not in user_roles:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Insufficient permissions",
                    headers={"WWW-Authenticate": "Bearer"},
                )
            return token_data.sub
        except (JWTError, ValidationError):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
    return _inner
from datetime import datetime, timedelta, timezone
from typing import Annotated, Any

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from jose import JWTError
from pydantic import ValidationError

from app.core.config import settings
from app.infrastructure.redis.dependencies import (
   is_jti_revoked,
   save_refresh_token_jti,
   save_refresh_token_version,
   token_versioned_check,
)
from app.middleware.jwt import create_access_token, create_refresh_token, decode_token
from app.modules.auth.schemas.auth import (
   LoginRequest,
   RegisterRequest,
   TokenResponse,
)
from app.modules.auth.service.auth_service import AuthService
from app.modules.auth.service.dependencies import get_auth_service

# To Do: Finish out refresh token endpoint and register user endpoint


get_auth_service_dependency = Annotated[AuthService, Depends(get_auth_service)]


router = APIRouter(tags=["auth"])

@router.post('/login',response_model=TokenResponse,tags=['auth'])
async def login_for_access_token(service: get_auth_service_dependency,request: LoginRequest,response:Response) -> TokenResponse:
   """
    OAuth2 compatible token login, returns an access token
    """
   try:
      # setting refresh token in httponly cookies
      results = await service.login_user(request)
      print('Storing refresh token in jwt')
      response.set_cookie(
         key="refresh_token",
         value=results.data.refresh_token,
         path="/api/v1/auth",
         httponly=True, # Prevents client-side JS from accessing the cookie , # Set to True in production with HTTPS  # Recommended: Only send cookie over HTTPS
         samesite="lax", # Default browser behavior; restricts cross-site sending
         secure=False,
         max_age=60 * 60 * 24 * settings.refresh_token_expire_days # in seconds

      )
      print('Refresh token stored in jwt returning to the client')
      print('auth resutls:',results)
      return results
   except LookupError as e:
       raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=str(e)
      )
   except ValueError as e:
      raise HTTPException(
         status_code=status.HTTP_400_BAD_REQUEST,
         detail=str(e),
      )
   except PermissionError as e:
      raise HTTPException(
         status_code=status.HTTP_403_FORBIDDEN,
         detail=str(e)
      )
   except RuntimeError:
      raise HTTPException(
         status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
         detail="Internal server error"
      )



@router.post("/register",response_model=TokenResponse, tags=["auth"])
async def register_for_access_token(request:RegisterRequest,service:get_auth_service_dependency,response:Response) -> TokenResponse:
   """
   Create a user and generate a jwt token
   """
   try:
      results = await service.register_user(request)
      response.set_cookie(
         key="refresh_token",
         value=results.data.refresh_token,
         path="/api/v1/auth",
         httponly=True, # Set to True in production with HTTPS
         samesite="lax",
         secure=False,
         max_age=60 * 60 * 24 * settings.refresh_token_expire_days  # in seconds

      )
      print('Refresh token stored in jwt returning to the client')
      print('auth resutls:',results)
      return results
   except ValueError as e:
      raise HTTPException(
         status_code=status.HTTP_409_CONFLICT,
         detail=str(e)
      )
   except RuntimeError:
      raise HTTPException(
         status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
         detail="Internal Server Error"
         )


@router.post('/refresh',response_model=TokenResponse,tags=['auth'])
async def refresh_token(request:Request,response:Response) -> Any:

   """ Refresh Token Endpoint"""

   try:
      # extract refresh token from httponly cookie
      refresh_token_cookie = request.cookies.get("refresh_token")
      # if not refresh token in cookies return 401 error
      if not refresh_token_cookie:
         raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Invalid refresh token'
            )
      
      # verify token signature
      token_verified = decode_token(refresh_token_cookie)

      # step 1: extract sub, ver and jti from claim
      sub= token_verified.get('sub')
      ver = int(token_verified.get('ver',0))
      jti = token_verified.get('jti')

      # check jwt claims
      if not all([sub, ver, jti]):
         raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token claims"
      )

      # step 2: fetch jti and check if jti exists in redis
      jti_results = await is_jti_revoked(jti)

      if jti_results:
         await save_refresh_token_version(sub,ver)
         raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="jti is already used"
         )
      
      # step 3: Get token version from redis
      ver_results = await token_versioned_check(sub)
      # if version doesn't equal the version in redis raise 401 error
      if ver != ver_results:
         raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="version missmatch with token"
         )
      
      # get remaining ttl
      exp = datetime.fromtimestamp(token_verified['exp'], tz=timezone.utc)
      remaining_ttl = exp - datetime.now(tz=timezone.utc)
      
      # step 4: Burn old token if the version matches
      await save_refresh_token_jti(jti,expires_in=remaining_ttl)

      # increment version so old tokens with the old ver are invalid
      new_ver = ver + 1
      await save_refresh_token_version(sub, new_ver)
      # create new refresh token with the incremented version
     
      # if token has not been revoked we will issue a new access and refresh token
      access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
      # generate the access token
      access_token = create_access_token(
         subject=sub,  # from verified token, not request body
         roles=token_verified.get('roles'),  # from verified token
         email_verified=token_verified.get('email_verified', ''),
         expires_delta=access_token_expires
      )

      new_refresh_token = create_refresh_token(subject=sub,ver=new_ver)

      response.set_cookie(
         key="refresh_token",
         value=new_refresh_token,
         path="/api/v1/auth",
         httponly=True,
         secure=False, # Set to True in production with HTTPS
         samesite="lax",
         max_age=60 * 60 * 24 * settings.refresh_token_expire_days  # in seconds

      )

      return {
         "access_token":access_token,
      }
   except (JWTError, ValidationError):
      raise HTTPException(
      status_code=status.HTTP_403_FORBIDDEN,
      detail="Could not validate credentials",
      headers={"WWW-Authenticate": "Bearer"}
    )
   except HTTPException:
      raise
   except Exception as e:
      # True unexpected errors only — Redis down, DB down, etc.
      print(f'Error at refresh endpoint: {e}')  # swap for proper logging later
      raise HTTPException(
         status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
         detail="Internal server error"
      )

@router.post('/logout', tags=['auth'])
async def logout(request:Request,response: Response):
   refresh_token = request.cookies.get('refresh_token')
   if not refresh_token:
      raise HTTPException(
         status_code=status.HTTP_401_UNAUTHORIZED,
         detail="no refresh token!"
      )
   # verify token signature
   token_verified = decode_token(refresh_token)
   if not token_verified:
      raise HTTPException(
         status_code=status.HTTP_401_UNAUTHORIZED,
         detail="Invalid signature",
         headers={"WWW-Authenticate": "Bearer"}
      )
   
   jti = token_verified.get('jti')

    # get remaining ttl
   exp = datetime.fromtimestamp(token_verified['exp'], tz=timezone.utc)
   remaining_ttl = exp - datetime.now(tz=timezone.utc)

   await save_refresh_token_jti(jti,expires_in=remaining_ttl)

   response.delete_cookie(
        key="refresh_token",
        path="/api/v1/auth",
        httponly=True,
        secure=True,
        samesite="lax"
    )
   return {"message": "Successfully logged out"}
   


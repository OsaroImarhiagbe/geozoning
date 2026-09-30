

from app.infrastructure.redis.client import redis_client


async def save_refresh_token_version(user_id:str,ver: int, expires_in: int) -> None:
    """
    Stores the valid token version for a user.
    Automatically expires when the refresh token becomes invalid.
    """
    # 1. Reconstruct your specific key format
    key = f"user:auth:v1:{user_id}"

    # 2. increment ver if jti is in redis
    ver+=1

    # 3. Serialize to JSON string and set the key with an expiration time
    await redis_client.set(key, str(ver), ex=expires_in)

async def save_refresh_token_jti(jti:str, expires_in: int) -> None:
    """
    Stores the valid JTI for a user.
    Automatically expires when the refresh token becomes invalid.
    """
    # 1. Reconstruct your specific key format
    key = "token:used:jti"
    
    # 2. Serialize to JSON string and set the key with an expiration time
    await redis_client.set(key, jti, ex=expires_in)



async def is_jti_revoked(user_id:str) -> bool:
    """
    Check if jti is in redis
    """
    key = "token:used:jti"

    return bool(await redis_client.get(key))

async def token_versioned_check(user_id:str) -> int:
    """
    grab the token version from redis
    """
    key = f"user:auth:v1:{user_id}"
    return await redis_client.get(key)

# def is_refresh_token_valid(user_id: str, incoming_jti: str, incoming_ver: int) -> bool:
#     key = f"user:auth:v1:{user_id}"
    
#     # 1. Fetch the data from Redis
#     stored_data_raw = redis_client.get(key)
    
#     # If the key doesn't exist, the token has expired or was revoked
#     if not stored_data_raw:
#         return False
        
#     # 2. Parse the JSON payload
#     stored_data = json.loads(stored_data_raw)
    
#     # 3. Both JTI and version must match exactly
#     is_jti_match = stored_data.get("jti") == incoming_jti
#     is_ver_match = stored_data.get("ver") == incoming_ver
    
#     return is_jti_match and is_ver_match


# # checking if refresh token has been revoked since, access token is short lived
# def verify_token_not_revoked(token:str) -> None:
#     if is_token_revoked(token):
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Token has been revoked",
#             headers={"WWW-Authenticate": "Bearer"},
#         )




# def rotate_refresh_token(user_id: str, incoming_jti: str, incoming_ver: int, expires_in: int) -> dict or None:
#     """Verifies the old refresh token metadata, and returns a new jti if valid.

#     If an old/reused token is detected, it revokes the session entirely.
#     """
#     key = f"user:auth:v1:{user_id}"

#     # 1. Fetch current active metadata
#     stored_data_raw = redis_client.get(key)

#     # Breach Detection: If token is used but metadata is missing,
#     # it may have expired or already been rotated/stolen.
#     if not stored_data_raw:
#         return None

#     stored_data = json.loads(stored_data_raw)

#     # 2. Check for Token Reuse (Replay Attack Detection)
#     # If the version matches but the JTI doesn't, this is an old token!
#     if (
#         stored_data.get("ver") == incoming_ver
#         and stored_data.get("jti") != incoming_jti
#     ):
#         print(f"SECURITY ALERT: Token reuse detected for user {user_id}!")
#         redis_client.delete(key)  # Revoke everything instantly
#         return None

#     # 3. Standard verification check
#     if (
#         stored_data.get("jti") != incoming_jti
#         or stored_data.get("ver") != incoming_ver
#     ):
#         return None

#     # 4. Generate a brand new JTI for the new refresh token
#     new_jti = str(uuid.uuid4())

#     # 5. Overwrite the old metadata in Redis with the new JTI
#     # Keep the same token version unless doing a global logout
#     new_payload = {"jti": new_jti, "ver": incoming_ver}

#     redis_client.set(key, json.dumps(new_payload), ex=expires_in)

#     # Return the new JTI to be packaged into your new JWT token payload
#     return {"new_jti": new_jti, "ver": incoming_ver}





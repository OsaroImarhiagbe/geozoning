import redis.asyncio as redis

from app.core.config import settings

# Initialize Redis connection
redis_client = redis.Redis(
    host=settings.redis_host,
    port=settings.redis_port,
    db=settings.redis_db,
    password=settings.redis_password # need to create a password
)
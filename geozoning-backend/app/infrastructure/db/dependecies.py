from typing import Annotated

from fastapi import Depends
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.infrastructure.db.session import AsyncSessionLocal
from app.middleware.dependencies import get_current_user_id

get_current_user_id_dependency = Annotated[str,Depends(get_current_user_id)]

# Public — registration, login, refresh
async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()

# Protected — all authenticated routes
async def get_auth_db(user_id:get_current_user_id_dependency,db: AsyncSession = Depends(get_db)):
    await db.execute(text("SET LOCAL ROLE authenticated"))
    await db.execute(
        text("SET LOCAL app.current_user_id = :user_id"),
        {"user_id": user_id}
    )
    yield db


# async def get_db(current_user:get_current_user_id_dependency):
#     async with AsyncSessionLocal() as session:
#         """FastAPI dependency that yields one database session per request.
    
#         Usage in a route:
#             from fastapi import Depends
#             from app.db.session import get_db
    
#             @router.get("/items")
#             async def list_items(db: AsyncSession = Depends(get_db)):
#                 ...
    
#         The session is:
#         - rolled back automatically on any exception
#         - always closed after the response is sent
#     """
#         try:
#             await session.execute(text("SET LOCAL ROLE authenticated"))
#             await session.execute(
#                     text("SET LOCAL app.current_user_id = :user_id"),
#                     {"user_id": str(current_user)}
#                 )
#             yield session
#             # will let each API endpoint commit to the db
#         except Exception:
#             await session.rollback()
#             raise
#         finally:
#             await session.close()
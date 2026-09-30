# ── 2. Database Engine + Session Factory (db/session.py) ──────────────────────
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from app.core.config import settings

# The engine manages the connection pool.
# One engine per application — create it once at module level.
engine = create_async_engine(
    settings.fastapi_database_url(),
    # Logs all SQL statements when True — great for debugging, off in prod
    echo=False,
    # Ping connections before handing them out of the pool.
    # Catches stale connections after a DB restart without crashing a request.
    pool_pre_ping=True,
    # Max number of persistent connections kept in the pool.
    # For a single server: 5–10 is usually fine.
    # For multiple uvicorn workers: each worker has its own pool,
    # so total connections = pool_size × workers. Size accordingly.
    pool_size=10,
    # Extra connections allowed ABOVE pool_size when the pool is saturated.
    # These are created on demand and closed when released.
    max_overflow=20,
    # Seconds a request will wait for a connection before raising TimeoutError.
    pool_timeout=30,
    # Seconds a connection can sit idle in the pool before being recycled.
    # Set lower than PostgreSQL's idle_in_transaction_session_timeout.
    pool_recycle=1800,
)
 
 
# Session factory — call this to get a new AsyncSession.
# expire_on_commit=False prevents SQLAlchemy from expiring ORM objects
# after a commit, which would trigger lazy loads (and fail in async context).

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)








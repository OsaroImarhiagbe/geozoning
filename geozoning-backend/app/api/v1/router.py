# api/v1/router.py
from fastapi import APIRouter

from app.modules.auth.api.v1.auth import router as auth_router
from app.modules.health.api.v1.health import router as health_router
from app.modules.zoning.api.v1.zoning import router as zoning_router
router = APIRouter()


router.include_router(auth_router, prefix="/auth")
router.include_router(health_router,prefix="/health")
router.include_router(zoning_router,prefix="/zoning")
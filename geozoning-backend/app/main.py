from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.v1.router import router as v1_router
from app.core.config import settings

app = FastAPI(
    title=settings.project_name,
    openapi_url=f"{settings.api_v1_str}/openapi.json"
)
# Define the origins that are allowed to make requests to your API
origins = [
    "http://localhost:8080",      # React default port
    "https://yourdomain.com",     # Production domain
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        # List of allowed origins
    allow_credentials=True,       # Allow cookies and auth headers
    allow_methods=["*"],          # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],          # Allow all custom HTTP headers
)


app.include_router(v1_router, prefix=settings.api_v1_str)

@app.exception_handler(404)
async def not_found_handler(request, exc):
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
       content={"success": False, "message": "Resource not found"}
    )

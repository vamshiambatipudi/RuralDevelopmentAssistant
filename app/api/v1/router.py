from fastapi import APIRouter

from app.api.v1.endpoints.auth import router as auth_router
from app.api.v1.endpoints.content import router as content_router
from app.api.v1.endpoints.crops import router as crops_router
from app.api.v1.endpoints.telemedicine import router as telemedicine_router

api_router = APIRouter()
api_router.include_router(auth_router)
api_router.include_router(content_router)
api_router.include_router(crops_router)
api_router.include_router(telemedicine_router)

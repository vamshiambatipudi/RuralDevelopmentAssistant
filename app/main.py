from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlmodel import Session

from app.api.v1.router import api_router
from app.core.config import settings
from app.core.database import create_db_and_tables, engine
from app.ml.train_yield_model import train_models
from app.utils.seed import seed_db


@asynccontextmanager
async def lifespan(_: FastAPI):
    create_db_and_tables()
    train_models()
    with Session(engine) as session:
        seed_db(session)
    yield


app = FastAPI(title=settings.app_name, version=settings.app_version, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Rural Development Assistant backend is running", "docs": "/docs"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.exception_handler(ValueError)
async def value_error_handler(_, exc: ValueError):
    return JSONResponse(status_code=400, content={"detail": str(exc)})


app.include_router(api_router, prefix=settings.api_prefix)

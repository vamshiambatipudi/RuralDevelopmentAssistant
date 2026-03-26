from fastapi import APIRouter, Depends, Query
from sqlmodel import Session, select

from app.core.database import get_session
from app.core.security import get_current_user
from app.models.content import JobPosting, Scheme, SkillCourse
from app.schemas.content import JobRead, SchemeRead, SkillCourseRead
from app.services.jobs import get_jobs, get_skills
from app.services.schemes import fetch_schemes_from_provider
from app.services.weather import fetch_weather

router = APIRouter(tags=["content"])


@router.get("/schemes", response_model=list[SchemeRead])
async def list_schemes(sync_provider: bool = Query(default=False), session: Session = Depends(get_session), _: object = Depends(get_current_user)):
    if sync_provider:
        provider_rows = await fetch_schemes_from_provider()
        for row in provider_rows:
            session.add(Scheme(**row))
        session.commit()
    return session.exec(select(Scheme).where(Scheme.is_active == True)).all()  # noqa: E712


@router.get("/jobs", response_model=list[JobRead])
def list_jobs(sync_provider: bool = Query(default=False), session: Session = Depends(get_session), _: object = Depends(get_current_user)):
    if sync_provider:
        for row in get_jobs():
            session.add(JobPosting(**row))
        for row in get_skills():
            session.add(SkillCourse(**row))
        session.commit()
    return session.exec(select(JobPosting).where(JobPosting.is_active == True)).all()  # noqa: E712


@router.get("/skills", response_model=list[SkillCourseRead])
def list_skills(session: Session = Depends(get_session), _: object = Depends(get_current_user)):
    return session.exec(select(SkillCourse).where(SkillCourse.is_active == True)).all()  # noqa: E712


@router.get("/weather")
async def weather(latitude: float, longitude: float, _: object = Depends(get_current_user)):
    return await fetch_weather(latitude=latitude, longitude=longitude)

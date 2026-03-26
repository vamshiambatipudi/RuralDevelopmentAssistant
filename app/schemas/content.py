from typing import Optional
from pydantic import BaseModel


class SchemeRead(BaseModel):
    id: int | None = None
    title: str
    category: str
    state: str
    summary: str
    eligibility: str
    benefits: str
    source_url: Optional[str] = None


class JobRead(BaseModel):
    id: int | None = None
    title: str
    organization: str
    location: str
    employment_type: str
    salary_min: Optional[float] = None
    salary_max: Optional[float] = None
    skills: str
    description: str
    source_url: Optional[str] = None


class SkillCourseRead(BaseModel):
    id: int | None = None
    title: str
    provider: str
    level: str
    duration: str
    tags: str
    description: str
    source_url: Optional[str] = None

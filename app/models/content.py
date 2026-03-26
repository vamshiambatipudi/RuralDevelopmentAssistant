from datetime import datetime
from typing import Optional

from sqlmodel import Field, SQLModel


class Scheme(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(index=True)
    category: str = Field(index=True)
    state: str = Field(default="India", index=True)
    summary: str
    eligibility: str
    benefits: str
    source_url: Optional[str] = None
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)


class JobPosting(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(index=True)
    organization: str
    location: str = Field(index=True)
    employment_type: str
    salary_min: Optional[float] = None
    salary_max: Optional[float] = None
    skills: str
    description: str
    source_url: Optional[str] = None
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)


class SkillCourse(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(index=True)
    provider: str
    level: str
    duration: str
    tags: str
    description: str
    source_url: Optional[str] = None
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

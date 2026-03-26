from datetime import datetime
from typing import Optional

from sqlmodel import Field, SQLModel


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    full_name: str
    email: str = Field(index=True, unique=True)
    phone: Optional[str] = None
    role: str = Field(default="user", index=True)
    password_hash: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

from datetime import datetime
from typing import Optional

from sqlmodel import Field, SQLModel


class Doctor(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    full_name: str
    specialty: str
    email: str = Field(unique=True, index=True)
    phone: Optional[str] = None
    available_days: str = "Mon,Tue,Wed,Thu,Fri"
    available_time_slots: str = "09:00,11:00,14:00,16:00"


class PatientRecord(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    age: int
    gender: str
    blood_group: Optional[str] = None
    allergies: Optional[str] = None
    chronic_conditions: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Appointment(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    patient_user_id: int = Field(foreign_key="user.id", index=True)
    doctor_id: int = Field(foreign_key="doctor.id", index=True)
    scheduled_for: datetime = Field(index=True)
    status: str = Field(default="scheduled", index=True)
    symptoms: Optional[str] = None
    meeting_link: Optional[str] = None
    secure_room_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

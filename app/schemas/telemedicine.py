from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class DoctorCreate(BaseModel):
    full_name: str
    specialty: str
    email: EmailStr
    phone: Optional[str] = None
    available_days: str = "Mon,Tue,Wed,Thu,Fri"
    available_time_slots: str = "09:00,11:00,14:00,16:00"


class DoctorRead(DoctorCreate):
    id: int


class PatientRecordCreate(BaseModel):
    age: int = Field(gt=0, le=120)
    gender: str
    blood_group: Optional[str] = None
    allergies: Optional[str] = None
    chronic_conditions: Optional[str] = None
    notes: Optional[str] = None


class PatientRecordRead(PatientRecordCreate):
    id: int
    user_id: int


class AppointmentCreate(BaseModel):
    doctor_id: int
    scheduled_for: datetime
    symptoms: Optional[str] = None


class AppointmentRead(BaseModel):
    id: int
    patient_user_id: int
    doctor_id: int
    scheduled_for: datetime
    status: str
    symptoms: Optional[str] = None
    meeting_link: Optional[str] = None
    secure_room_id: Optional[str] = None

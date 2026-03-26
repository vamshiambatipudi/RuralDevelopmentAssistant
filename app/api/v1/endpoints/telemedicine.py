from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.core.database import get_session
from app.core.security import get_current_user, require_admin
from app.models.telemedicine import Appointment, Doctor, PatientRecord
from app.models.user import User
from app.schemas.telemedicine import AppointmentCreate, AppointmentRead, DoctorCreate, DoctorRead, PatientRecordCreate, PatientRecordRead
from app.services.telemedicine import generate_secure_room

router = APIRouter(prefix="/telemedicine", tags=["telemedicine"])


@router.get("/doctors", response_model=list[DoctorRead])
def list_doctors(session: Session = Depends(get_session), _: User = Depends(get_current_user)):
    return session.exec(select(Doctor)).all()


@router.post("/doctors", response_model=DoctorRead, status_code=201)
def create_doctor(payload: DoctorCreate, session: Session = Depends(get_session), _: User = Depends(require_admin)):
    doctor = Doctor.model_validate(payload)
    session.add(doctor)
    session.commit()
    session.refresh(doctor)
    return doctor


@router.post("/patient-record", response_model=PatientRecordRead, status_code=201)
def create_patient_record(payload: PatientRecordCreate, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    existing = session.exec(select(PatientRecord).where(PatientRecord.user_id == current_user.id)).first()
    if existing:
        raise HTTPException(status_code=409, detail="Patient record already exists")
    record = PatientRecord(user_id=current_user.id, **payload.model_dump())
    session.add(record)
    session.commit()
    session.refresh(record)
    return record


@router.get("/patient-record/me", response_model=PatientRecordRead | None)
def get_my_record(current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    return session.exec(select(PatientRecord).where(PatientRecord.user_id == current_user.id)).first()


@router.post("/appointments", response_model=AppointmentRead, status_code=201)
def create_appointment(payload: AppointmentCreate, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    doctor = session.get(Doctor, payload.doctor_id)
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    secure_room = generate_secure_room()
    appointment = Appointment(patient_user_id=current_user.id, **payload.model_dump(), **secure_room)
    session.add(appointment)
    session.commit()
    session.refresh(appointment)
    return appointment


@router.get("/appointments/me", response_model=list[AppointmentRead])
def list_my_appointments(current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    return session.exec(select(Appointment).where(Appointment.patient_user_id == current_user.id)).all()

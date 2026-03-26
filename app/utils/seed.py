from datetime import date
from sqlmodel import Session, select

from app.core.security import get_password_hash
from app.models.content import JobPosting, Scheme, SkillCourse
from app.models.crop import CropType, PlantingSchedule, YieldRecord
from app.models.telemedicine import Doctor
from app.models.user import User


def seed_db(session: Session) -> None:
    if not session.exec(select(User)).first():
        session.add(User(full_name="Admin User", email="admin@rda.local", role="admin", password_hash=get_password_hash("Admin@123")))
        session.add(User(full_name="Demo Farmer", email="farmer@rda.local", role="user", password_hash=get_password_hash("Farmer@123")))

    if not session.exec(select(CropType)).first():
        rice = CropType(name="Rice", category="Cereal", soil_type="Clay loam", water_requirement_mm=1200, optimal_temperature_c=28, notes="Suitable for kharif season")
        maize = CropType(name="Maize", category="Cereal", soil_type="Loamy", water_requirement_mm=600, optimal_temperature_c=26)
        session.add(rice)
        session.add(maize)
        session.commit()
        session.refresh(rice)
        session.refresh(maize)
        session.add(PlantingSchedule(crop_id=rice.id, region="Telangana", season="Kharif", sowing_start=date(2026,6,15), sowing_end=date(2026,7,15), harvest_start=date(2026,10,1), harvest_end=date(2026,11,15), irrigation_frequency_days=5, fertilizer_plan="NPK 20:10:10 at sowing"))
        session.add(YieldRecord(crop_id=rice.id, region="Telangana", farm_size_acres=2.5, soil_ph=6.2, rainfall_mm=820, temperature_c=29, humidity_pct=72, ndvi_score=0.74, disease_pressure="low", actual_yield_tonnes=5.1, recorded_on=date(2025,11,15)))

    if not session.exec(select(Doctor)).first():
        session.add(Doctor(full_name="Dr. Kavya Reddy", specialty="General Medicine", email="doctor1@rda.local", phone="9999999999"))
        session.add(Doctor(full_name="Dr. Arjun Rao", specialty="Dermatology", email="doctor2@rda.local", phone="8888888888"))

    if not session.exec(select(Scheme)).first():
        session.add(Scheme(title="PM-KISAN", category="farmers", state="India", summary="Income support scheme for eligible farmers.", eligibility="Eligible farmer families", benefits="Periodic DBT support", source_url="https://pmkisan.gov.in/"))
        session.add(JobPosting(title="Village Data Coordinator", organization="Rural Development Cell", location="Hyderabad", employment_type="Full-time", salary_min=20000, salary_max=28000, skills="MS Excel, reporting, communication", description="Coordinate rural data collection and reporting", source_url="https://www.ncs.gov.in/"))
        session.add(SkillCourse(title="Agri Entrepreneurship", provider="Skill India", level="Beginner", duration="5 weeks", tags="agriculture,business", description="Basics of agribusiness and village entrepreneurship", source_url="https://www.ncs.gov.in/"))

    session.commit()

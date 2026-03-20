from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional
from pathlib import Path
import json

from ml.crop_logic import recommend_crop

app = FastAPI(title="Rural Development Assistant API", version="1.0.0")

# ---------- CORS (React frontend connection) ----------
# If your frontend runs on Vite: http://localhost:5173
# If your frontend runs on CRA:  http://localhost:3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://127.0.0.1:8080",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


BASE_DIR = Path(__file__).resolve().parent
SCHEMES_PATH = BASE_DIR / "data" / "schemes.json"


# ---------- Basic routes ----------
@app.get("/")
def home():
    return {"status": "ok", "message": "RDA backend is running. Open /docs for API docs."}

@app.get("/health")
def health():
    return {"status": "ok"}


# ---------- Crop Recommendation ----------
class CropInput(BaseModel):
    soil_type: str = Field(..., examples=["black"])
    season: str = Field(..., examples=["kharif"])
    farm_size: float = Field(..., ge=0, examples=[2])
    rainfall: float = Field(..., ge=0, examples=[700])

    # Optional extra fields (safe to add now; frontend can send later)
    temperature: Optional[float] = Field(None, examples=[30])
    irrigation: Optional[str] = Field(None, examples=["drip"])

@app.post("/crop-recommend")
def crop_recommendation(data: CropInput):
    crop = recommend_crop(
        soil_type = data.soil_type,
        season = data.season,
        rainfall = data.rainfall,
        farm_size = data.farm_size,
        irrigation = data.irrigation,
    )

    return {"status": "success", "recommended_crop": crop}


# ---------- Government Schemes ----------
@app.get("/schemes")
def get_schemes(category: Optional[str] = None, q: Optional[str] = None):
    # Load schemes
    if not SCHEMES_PATH.exists():
        return []

    schemes = json.loads(SCHEMES_PATH.read_text(encoding="utf-8"))

    # Filter by category (Farmer/Women/Youth/etc.)
    if category:
        c = category.strip().lower()
        schemes = [s for s in schemes if str(s.get("category", "")).lower() == c]

    # Search by keyword in name/description
    if q:
        key = q.strip().lower()
        schemes = [
            s for s in schemes
            if key in str(s.get("name", "")).lower() or key in str(s.get("description", "")).lower()
        ]

    return schemes

# ---------- Telemedicine (Basic Symptom Assistant) ----------
class HealthInput(BaseModel):
    language: str = Field("en", examples=["en", "hi"])
    mode: str = Field("chat", examples=["chat", "voice"])
    symptoms: str = Field(..., examples=["fever, headache, cough"])
    age: Optional[int] = Field(None, ge=0, examples=[25])
    duration_days: Optional[int] = Field(None, ge=0, examples=[2])

def analyze_symptoms(symptoms_text: str):
    text = (symptoms_text or "").lower()

    emergency_flags = [
        "chest pain", "difficulty breathing", "breathing problem", "unconscious",
        "severe bleeding", "stroke", "seizure", "fainting"
    ]

    if any(flag in text for flag in emergency_flags):
        return {
            "severity": "emergency",
            "advice": [
                "⚠ This may be serious. Please visit a doctor/hospital immediately.",
                "If emergency, call local emergency services."
            ],
            "self_care": [],
            "disclaimer": "This is not a medical diagnosis. Consult a qualified doctor."
        }

    common_advice = []
    self_care = []

    if "fever" in text:
        common_advice.append("You may have fever. Monitor temperature and rest.")
        self_care.append("Drink fluids, rest, and keep hydrated.")
    if "cough" in text or "cold" in text or "sore throat" in text:
        common_advice.append("Symptoms suggest cold/cough.")
        self_care.append("Warm water/steam inhalation may help.")
    if "stomach pain" in text or "vomiting" in text or "diarrhea" in text:
        common_advice.append("Possible stomach infection or indigestion.")
        self_care.append("ORS + light food. Avoid oily/spicy meals.")

    if not common_advice:
        common_advice.append("Please describe symptoms in more detail for better guidance.")

    return {
        "severity": "mild",
        "advice": common_advice,
        "self_care": self_care,
        "disclaimer": "This is not a medical diagnosis. Consult a qualified doctor."
    }

@app.post("/telemedicine/analyze")
def telemedicine_analyze(data: HealthInput):
    result = analyze_symptoms(data.symptoms)
    # Multilingual support: for now return same text; frontend can translate
    return {"status": "success", "mode": data.mode, "language": data.language, "result": result}


# ---------- Job & Skill Development ----------
JOBS_PATH = BASE_DIR / "data" / "jobs.json"
COURSES_PATH = BASE_DIR / "data" / "courses.json"

@app.get("/jobs")
def get_jobs(q: Optional[str] = None):
    if not JOBS_PATH.exists():
        return []

    jobs = json.loads(JOBS_PATH.read_text(encoding="utf-8"))

    if q:
        key = q.strip().lower()
        jobs = [
            j for j in jobs
            if key in str(j.get("title", "")).lower()
            or key in str(j.get("location", "")).lower()
            or key in " ".join(j.get("skills", [])).lower()
        ]
    return jobs

@app.get("/courses")
def get_courses(category: Optional[str] = None, q: Optional[str] = None):
    if not COURSES_PATH.exists():
        return []

    courses = json.loads(COURSES_PATH.read_text(encoding="utf-8"))

    if category:
        c = category.strip().lower()
        courses = [x for x in courses if str(x.get("category", "")).lower() == c]

    if q:
        key = q.strip().lower()
        courses = [x for x in courses if key in str(x.get("name", "")).lower()]

    return courses

# ---------- Weather Forecast ----------
from utils.weather_api import get_weather

class WeatherInput(BaseModel):
    city: str = Field(..., examples=["Hyderabad"])

@app.post("/weather")
def weather(data: WeatherInput):
    info = get_weather(data.city)
    return {"status": "success", "weather": info}

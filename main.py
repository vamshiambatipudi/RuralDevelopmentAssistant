from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import json

app = FastAPI()

# CORS middleware to allow frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------ Crop Recommendation API ------------------

class CropInput(BaseModel):
    soil_type: str
    rainfall: float
    season: str

@app.post("/recommend-crop/")
def recommend_crop(data: CropInput):
    # Basic rule-based recommendation
    if data.season.lower() == "summer":
        crop = "Groundnut"
    elif data.season.lower() == "winter":
        crop = "Wheat"
    elif data.season.lower() == "rainy":
        crop = "Rice"
    else:
        crop = "Maize"
    return {"recommended_crop": crop}

# ------------------ Scheme Info API ------------------

@app.get("/get-schemes/")
def get_schemes():
    with open("scheme_data.json") as file:
        schemes = json.load(file)
    return {"schemes": schemes}

# ------------------ Health Advice API ------------------

@app.get("/health-advice/")
def health_advice(symptom: str):
    if "fever" in symptom.lower():
        return {"advice": "Take paracetamol, rest, stay hydrated. Visit PHC if persists."}
    elif "cough" in symptom.lower():
        return {"advice": "Take steam, avoid cold drinks. Visit health center if severe."}
    else:
        return {"advice": "Please visit the nearest health center for proper check-up."}

# ------------------ Job Listings API ------------------

@app.get("/jobs/")
def job_listings():
    jobs = [
        {"title": "Tailoring Course", "location": "Panchayat Hall"},
        {"title": "Farming Techniques Workshop", "location": "Krishi Vikas Kendra"},
        {"title": "Dairy Training", "location": "Block Office"},
    ]
    return {"jobs": jobs}

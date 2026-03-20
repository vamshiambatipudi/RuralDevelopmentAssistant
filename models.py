from pydantic import BaseModel


# Model for Crop Recommendation input
class CropInput(BaseModel):
    soil_type: str
    rainfall: float
    season: str


# Model for Health Advice (Optional for POST method)
class HealthInput(BaseModel):
    symptom: str

from datetime import date
from typing import Optional
from pydantic import BaseModel, Field


class CropTypeCreate(BaseModel):
    name: str
    category: str
    soil_type: str
    water_requirement_mm: float = Field(gt=0)
    optimal_temperature_c: float
    notes: Optional[str] = None


class CropTypeRead(CropTypeCreate):
    id: int


class PlantingScheduleCreate(BaseModel):
    crop_id: int
    region: str
    season: str
    sowing_start: date
    sowing_end: date
    harvest_start: date
    harvest_end: date
    irrigation_frequency_days: int = Field(gt=0)
    fertilizer_plan: Optional[str] = None


class PlantingScheduleRead(PlantingScheduleCreate):
    id: int


class YieldRecordCreate(BaseModel):
    crop_id: int
    region: str
    farm_size_acres: float = Field(gt=0)
    soil_ph: float = Field(ge=0, le=14)
    rainfall_mm: float = Field(ge=0)
    temperature_c: float
    humidity_pct: float = Field(ge=0, le=100)
    ndvi_score: float = Field(ge=0, le=1)
    disease_pressure: str = Field(pattern="^(low|medium|high)$")
    actual_yield_tonnes: float = Field(ge=0)
    recorded_on: date


class YieldRecordRead(YieldRecordCreate):
    id: int


class YieldPredictionRequest(BaseModel):
    crop_name: str
    region: str
    soil_ph: float = Field(ge=0, le=14)
    rainfall_mm: float = Field(ge=0)
    temperature_c: float
    humidity_pct: float = Field(ge=0, le=100)
    farm_size_acres: float = Field(gt=0)
    ndvi_score: float = Field(ge=0, le=1)
    disease_pressure: str = Field(pattern="^(low|medium|high)$")


class YieldPredictionResponse(BaseModel):
    predicted_yield_tonnes: float
    best_planting_window: str
    risk_level: str
    recommendations: list[str]

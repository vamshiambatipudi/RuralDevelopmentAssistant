from datetime import date, datetime
from typing import Optional

from sqlmodel import Field, SQLModel


class CropType(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True, unique=True)
    category: str
    soil_type: str
    water_requirement_mm: float
    optimal_temperature_c: float
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class PlantingSchedule(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    crop_id: int = Field(foreign_key="croptype.id", index=True)
    region: str = Field(index=True)
    season: str
    sowing_start: date
    sowing_end: date
    harvest_start: date
    harvest_end: date
    irrigation_frequency_days: int
    fertilizer_plan: Optional[str] = None


class YieldRecord(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    crop_id: int = Field(foreign_key="croptype.id", index=True)
    region: str = Field(index=True)
    farm_size_acres: float
    soil_ph: float
    rainfall_mm: float
    temperature_c: float
    humidity_pct: float
    ndvi_score: float = 0.5
    disease_pressure: str = Field(default="low")
    actual_yield_tonnes: float
    recorded_on: date

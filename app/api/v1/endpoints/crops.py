from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select

from app.core.database import get_session
from app.core.security import get_current_user, require_admin
from app.ml.predictor import predict
from app.models.crop import CropType, PlantingSchedule, YieldRecord
from app.schemas.crops import (
    CropTypeCreate,
    CropTypeRead,
    PlantingScheduleCreate,
    PlantingScheduleRead,
    YieldPredictionRequest,
    YieldPredictionResponse,
    YieldRecordCreate,
    YieldRecordRead,
)

router = APIRouter(prefix="/crops", tags=["crops"])


@router.get("/types", response_model=list[CropTypeRead])
def list_crop_types(session: Session = Depends(get_session), _: object = Depends(get_current_user)):
    return session.exec(select(CropType)).all()


@router.post("/types", response_model=CropTypeRead, status_code=201)
def create_crop_type(payload: CropTypeCreate, session: Session = Depends(get_session), _: object = Depends(require_admin)):
    crop = CropType.model_validate(payload)
    session.add(crop)
    session.commit()
    session.refresh(crop)
    return crop


@router.put("/types/{crop_id}", response_model=CropTypeRead)
def update_crop_type(crop_id: int, payload: CropTypeCreate, session: Session = Depends(get_session), _: object = Depends(require_admin)):
    crop = session.get(CropType, crop_id)
    if not crop:
        raise HTTPException(status_code=404, detail="Crop type not found")
    for key, value in payload.model_dump().items():
        setattr(crop, key, value)
    session.add(crop)
    session.commit()
    session.refresh(crop)
    return crop


@router.delete("/types/{crop_id}", status_code=204)
def delete_crop_type(crop_id: int, session: Session = Depends(get_session), _: object = Depends(require_admin)):
    crop = session.get(CropType, crop_id)
    if not crop:
        raise HTTPException(status_code=404, detail="Crop type not found")
    session.delete(crop)
    session.commit()


@router.get("/schedules", response_model=list[PlantingScheduleRead])
def list_schedules(region: str | None = Query(default=None), session: Session = Depends(get_session), _: object = Depends(get_current_user)):
    query = select(PlantingSchedule)
    if region:
        query = query.where(PlantingSchedule.region == region)
    return session.exec(query).all()


@router.post("/schedules", response_model=PlantingScheduleRead, status_code=201)
def create_schedule(payload: PlantingScheduleCreate, session: Session = Depends(get_session), _: object = Depends(require_admin)):
    schedule = PlantingSchedule.model_validate(payload)
    session.add(schedule)
    session.commit()
    session.refresh(schedule)
    return schedule


@router.get("/yields", response_model=list[YieldRecordRead])
def list_yields(session: Session = Depends(get_session), _: object = Depends(get_current_user)):
    return session.exec(select(YieldRecord)).all()


@router.post("/yields", response_model=YieldRecordRead, status_code=201)
def create_yield_record(payload: YieldRecordCreate, session: Session = Depends(get_session), _: object = Depends(require_admin)):
    record = YieldRecord.model_validate(payload)
    session.add(record)
    session.commit()
    session.refresh(record)
    return record


@router.post("/predict", response_model=YieldPredictionResponse)
def predict_yield(payload: YieldPredictionRequest, _: object = Depends(get_current_user)):
    predicted_yield, risk_level = predict(payload.model_dump())
    month_hint = "June to July" if payload.crop_name.lower() in {"rice", "maize"} else "October to November"
    recommendations = [
        f"Target planting window: {month_hint} for {payload.region}.",
        "Use integrated pest management when disease pressure is medium or high.",
        "Re-check irrigation if rainfall forecast falls below historical average.",
    ]
    return YieldPredictionResponse(
        predicted_yield_tonnes=predicted_yield,
        best_planting_window=month_hint,
        risk_level=risk_level,
        recommendations=recommendations,
    )

from pathlib import Path
import joblib
import pandas as pd

from app.ml.train_yield_model import train_models

BASE_DIR = Path(__file__).resolve().parents[2]
MODEL_DIR = BASE_DIR / "models_store"
YIELD_MODEL_PATH = MODEL_DIR / "yield_model.joblib"
RISK_MODEL_PATH = MODEL_DIR / "risk_model.joblib"


def _ensure_models() -> None:
    if not YIELD_MODEL_PATH.exists() or not RISK_MODEL_PATH.exists():
        train_models()


def predict(payload: dict) -> tuple[float, str]:
    _ensure_models()
    frame = pd.DataFrame([payload])
    yield_model = joblib.load(YIELD_MODEL_PATH)
    risk_model = joblib.load(RISK_MODEL_PATH)
    predicted_yield = float(yield_model.predict(frame)[0])
    risk_level = str(risk_model.predict(frame)[0])
    return round(predicted_yield, 2), risk_level

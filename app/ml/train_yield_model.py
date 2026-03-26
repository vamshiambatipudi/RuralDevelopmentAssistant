from pathlib import Path

import joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder

BASE_DIR = Path(__file__).resolve().parents[2]
MODEL_DIR = BASE_DIR / "models_store"
MODEL_DIR.mkdir(exist_ok=True)


def _synthetic_dataset() -> pd.DataFrame:
    rows = []
    crops = ["Rice", "Wheat", "Cotton", "Maize"]
    regions = ["Telangana", "Andhra Pradesh", "Karnataka", "Maharashtra"]
    disease_pressure_values = ["low", "medium", "high"]
    for crop in crops:
        for region in regions:
            for disease in disease_pressure_values:
                for rainfall in [450, 650, 800, 1000]:
                    for temp in [22, 26, 30, 34]:
                        humidity = 45 + (rainfall / 40)
                        soil_ph = 6.0 if crop in ["Rice", "Maize"] else 6.8
                        ndvi = 0.45 if disease == "high" else 0.72 if disease == "low" else 0.58
                        base_yield = {
                            "Rice": 4.5,
                            "Wheat": 3.9,
                            "Cotton": 2.6,
                            "Maize": 5.0,
                        }[crop]
                        rainfall_factor = 0.004 * rainfall
                        temp_penalty = max(0, abs(temp - 28)) * 0.12
                        disease_penalty = {"low": 0.2, "medium": 0.6, "high": 1.0}[disease]
                        yield_tonnes = max(0.8, base_yield + rainfall_factor - temp_penalty - disease_penalty + ndvi)
                        risk = "high" if disease == "high" or temp >= 34 else "medium" if disease == "medium" else "low"
                        rows.append(
                            {
                                "crop_name": crop,
                                "region": region,
                                "soil_ph": soil_ph,
                                "rainfall_mm": rainfall,
                                "temperature_c": temp,
                                "humidity_pct": min(95, humidity),
                                "farm_size_acres": 3.0,
                                "ndvi_score": ndvi,
                                "disease_pressure": disease,
                                "actual_yield_tonnes": round(yield_tonnes, 2),
                                "risk_level": risk,
                            }
                        )
    return pd.DataFrame(rows)


def train_models() -> None:
    df = _synthetic_dataset()
    features = [
        "crop_name",
        "region",
        "soil_ph",
        "rainfall_mm",
        "temperature_c",
        "humidity_pct",
        "farm_size_acres",
        "ndvi_score",
        "disease_pressure",
    ]
    categorical = ["crop_name", "region", "disease_pressure"]
    numeric = [x for x in features if x not in categorical]

    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore"), categorical),
            ("num", "passthrough", numeric),
        ]
    )

    yield_model = Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            ("regressor", RandomForestRegressor(n_estimators=150, random_state=42)),
        ]
    )
    risk_model = Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            ("classifier", RandomForestClassifier(n_estimators=150, random_state=42)),
        ]
    )

    X = df[features]
    yield_model.fit(X, df["actual_yield_tonnes"])
    risk_model.fit(X, df["risk_level"])

    joblib.dump(yield_model, MODEL_DIR / "yield_model.joblib")
    joblib.dump(risk_model, MODEL_DIR / "risk_model.joblib")


if __name__ == "__main__":
    train_models()

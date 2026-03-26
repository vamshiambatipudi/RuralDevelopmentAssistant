from typing import Any
import httpx

from app.core.config import settings


async def fetch_weather(latitude: float, longitude: float) -> dict[str, Any]:
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "current": "temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m",
        "daily": "temperature_2m_max,temperature_2m_min,precipitation_sum",
        "forecast_days": 5,
        "timezone": "auto",
    }
    async with httpx.AsyncClient(timeout=20) as client:
        response = await client.get(settings.weather_base_url, params=params)
        response.raise_for_status()
        data = response.json()
    return {
        "provider": "open-meteo",
        "latitude": data.get("latitude"),
        "longitude": data.get("longitude"),
        "current": data.get("current", {}),
        "daily": data.get("daily", {}),
    }

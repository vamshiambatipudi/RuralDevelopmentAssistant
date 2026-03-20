import requests

def get_weather(city: str):
    """
    Returns current weather for a given city.
    Uses Open-Meteo (no API key required).
    """

    if not city:
        return {"error": "City is required"}

    # 1) Geocode city -> lat/lon
    geo_url = "https://geocoding-api.open-meteo.com/v1/search"
    geo_res = requests.get(geo_url, params={"name": city, "count": 1, "language": "en", "format": "json"}, timeout=10)
    geo_res.raise_for_status()
    geo_data = geo_res.json()

    if "results" not in geo_data or len(geo_data["results"]) == 0:
        return {"error": f"City not found: {city}"}

    lat = geo_data["results"][0]["latitude"]
    lon = geo_data["results"][0]["longitude"]

    # 2) Get current weather
    weather_url = "https://api.open-meteo.com/v1/forecast"
    w_res = requests.get(
        weather_url,
        params={
            "latitude": lat,
            "longitude": lon,
            "current_weather": True,
        },
        timeout=10,
    )
    w_res.raise_for_status()
    w_data = w_res.json()

    current = w_data.get("current_weather", {})
    return {
        "city": city,
        "latitude": lat,
        "longitude": lon,
        "temperature": current.get("temperature"),
        "windspeed": current.get("windspeed"),
        "winddirection": current.get("winddirection"),
        "weathercode": current.get("weathercode"),
        "time": current.get("time"),
    }

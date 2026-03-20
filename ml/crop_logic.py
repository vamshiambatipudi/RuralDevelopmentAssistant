def normalize_season(season: str) -> str:
    s = (season or "").strip().lower()
    if "kharif" in s: return "kharif"
    if "rabi" in s: return "rabi"
    if "zaid" in s or "summer" in s: return "zaid"
    return s

def normalize_soil(soil: str) -> str:
    s = (soil or "").strip().lower()
    # map common soils to known buckets
    if "black" in s: return "black"
    if "red" in s: return "red"
    if "alluvial" in s: return "alluvial"
    if "clay" in s: return "clay"
    if "loam" in s: return "loamy"
    if "sand" in s: return "sandy"
    return s

def recommend_crop(soil_type, season, farm_size, rainfall):
    soil_type = normalize_soil(soil_type)
    season = normalize_season(season)

    if season == "kharif":
        if soil_type in ["black"] and rainfall > 600:
            return "Cotton"
        if soil_type in ["alluvial", "clay"] and rainfall > 800:
            return "Rice"
        if farm_size < 2:
            return "Vegetables"

    if season == "rabi":
        if soil_type in ["red", "sandy"]:
            return "Groundnut"
        if soil_type in ["black", "loamy"]:
            return "Wheat"

    if rainfall < 400:
        return "Millets"

    return "Pulses"

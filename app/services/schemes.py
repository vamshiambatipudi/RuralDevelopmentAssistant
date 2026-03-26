from typing import Any
import httpx

from app.core.config import settings


async def fetch_schemes_from_provider(resource_id: str | None = None, limit: int = 20) -> list[dict[str, Any]]:
    if settings.gov_data_api_key == "demo-key" or not resource_id:
        return [
            {
                "title": "PM-KISAN",
                "category": "farmers",
                "state": "India",
                "summary": "Income support to eligible landholding farmer families.",
                "eligibility": "Registered farmer families subject to scheme rules.",
                "benefits": "Direct benefit transfer in installments.",
                "source_url": "https://pmkisan.gov.in/",
            },
            {
                "title": "Ayushman Bharat PM-JAY",
                "category": "health",
                "state": "India",
                "summary": "Health insurance cover for eligible families.",
                "eligibility": "As per SECC / beneficiary list and state rules.",
                "benefits": "Cashless hospitalization cover.",
                "source_url": "https://pmjay.gov.in/",
            },
        ]

    endpoint = f"{settings.gov_data_base_url}/resource/{resource_id}"
    params = {"api-key": settings.gov_data_api_key, "format": "json", "limit": limit}
    async with httpx.AsyncClient(timeout=20) as client:
        response = await client.get(endpoint, params=params)
        response.raise_for_status()
        payload = response.json()
    records = payload.get("records", [])
    normalized = []
    for row in records:
        normalized.append(
            {
                "title": row.get("scheme_name") or row.get("title") or "Government Scheme",
                "category": row.get("category") or "general",
                "state": row.get("state") or "India",
                "summary": row.get("description") or row.get("summary") or "",
                "eligibility": row.get("eligibility") or row.get("beneficiary") or "Refer official source",
                "benefits": row.get("benefits") or row.get("assistance") or "Refer official source",
                "source_url": row.get("source_url") or row.get("url"),
            }
        )
    return normalized

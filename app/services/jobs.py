from typing import Any


def get_jobs(limit: int = 20) -> list[dict[str, Any]]:
    # Replace this provider with NCS scraping/API integration or a commercial jobs API.
    seed = [
        {
            "title": "Field Officer",
            "organization": "Rural Cooperative Society",
            "location": "Telangana",
            "employment_type": "Full-time",
            "salary_min": 18000,
            "salary_max": 25000,
            "skills": "Field surveys, reporting, communication",
            "description": "Coordinate farmer outreach and program enrollment.",
            "source_url": "https://www.ncs.gov.in/",
        },
        {
            "title": "Agri Data Assistant",
            "organization": "District Agri Office",
            "location": "Andhra Pradesh",
            "employment_type": "Contract",
            "salary_min": 15000,
            "salary_max": 22000,
            "skills": "Excel, data entry, basic agriculture knowledge",
            "description": "Maintain agricultural records and farmer reports.",
            "source_url": "https://www.ncs.gov.in/",
        },
    ]
    return seed[:limit]


def get_skills(limit: int = 20) -> list[dict[str, Any]]:
    seed = [
        {
            "title": "Organic Farming Basics",
            "provider": "Krishi Training Hub",
            "level": "Beginner",
            "duration": "4 weeks",
            "tags": "agriculture,soil,compost",
            "description": "Introductory skill course on sustainable farming methods.",
            "source_url": "https://www.ncs.gov.in/",
        },
        {
            "title": "Digital Services for Rural Entrepreneurs",
            "provider": "Skill India Partner",
            "level": "Intermediate",
            "duration": "6 weeks",
            "tags": "digital,payments,service-center",
            "description": "Digital skills for CSC-style entrepreneurship and local services.",
            "source_url": "https://www.ncs.gov.in/",
        },
    ]
    return seed[:limit]

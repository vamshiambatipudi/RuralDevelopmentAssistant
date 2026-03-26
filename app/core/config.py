from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Rural Development Assistant API"
    app_version: str = "1.0.0"
    api_prefix: str = "/api/v1"
    secret_key: str = "change-me-in-production"
    access_token_expire_minutes: int = 60 * 8
    database_url: str = "sqlite:///./rda.db"
    weather_base_url: str = "https://api.open-meteo.com/v1/forecast"
    gov_data_base_url: str = "https://api.data.gov.in"
    gov_data_api_key: str = "demo-key"
    jobs_provider: str = "mock"
    twilio_enabled: bool = False
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


settings = Settings()

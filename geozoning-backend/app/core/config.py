import os

from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    environment:str = os.getenv("ENVIRONMENT","development")
    api_v1_str: str = "/api/v1"
    project_name: str = "CollabAI API"

    # Security settings
    secret_key: SecretStr

    # jwt access + refresh token
    access_token_expire_minutes: int
    refresh_token_expire_days: int

    # Algorithm secret or not???
    algorithm:SecretStr

    # Redia
    redis_host:str
    redis_db:int
    redis_port:int
    redis_password:SecretStr

    #postgres db
    postgresql_port:int
    alembic_postgres_user: str
    fastapi_postgres_user:str
    postgres_password: SecretStr
    postgres_db:str
    postgres_host:str

    # Alembic Database url
    def alembic_database_url_sync(self) -> str:
        return f"postgresql+psycopg2://{self.alembic_postgres_user}:{self.postgres_password.get_secret_value()}@{self.postgres_host}:{self.postgresql_port}/{self.postgres_db}"
    
    # FastAPI Database url
    def fastapi_database_url(self) -> str:
        return f"postgresql+asyncpg://{self.fastapi_postgres_user}:{self.postgres_password.get_secret_value()}@{self.postgres_host}:{self.postgresql_port}/{self.postgres_db}"
    

    # Configuration for the model
    model_config = SettingsConfigDict(
        env_file=f".env.{environment}", 
        env_file_encoding="utf-8",
        case_sensitive=False
    )
    


try:
    settings = Settings()
    print("Environment settings are available! ")
except Exception as e:
    print(f'Booting environment error:{e}')
    exit(1) # what does this do?

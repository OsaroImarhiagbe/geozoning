# Use a slim Python image for smaller footprint
FROM python:3.12-slim

# Set Working Directory
WORKDIR /app

# Install curl for healthcheck and build dependencies for geospatial libraries
RUN apt-get update && apt-get install -y \
    curl \
    build-essential \
    libgdal-dev \
    gdal-bin \
    && rm -rf /var/lib/apt/lists/*

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Copy dependency files first to leverage Docker cache
COPY pyproject.toml uv.lock ./

# Install dependencies via uv
RUN uv sync --frozen --no-cache

ENV UV_PROJECT_ENVIRONMENT=/opt/venv
ENV UV_SYSTEM_PYTHON=1
# Copy the application code
COPY ./app /app/app

# Copy and set entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

# Expose the port FastAPI will run on
EXPOSE 8000

# Start the server using uvicorn
CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

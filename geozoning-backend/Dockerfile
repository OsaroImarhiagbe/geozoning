# Use a slim Python image for smaller footprint
FROM python:3.12-slim

# Set Working Directory
WORKDIR /app

# Install curl for healthcheck
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

#Install dependencies first to leverage Docker cache
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

#Copy the application code
COPY ./app /app/app

# Copy and set entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

#Expose the port FastAPI will run on
EXPOSE 8000

# Start the server using uvicorn
CMD ["uvicorn", "app.main:app","--host","0.0.0.0","--port","8000","--reload"]

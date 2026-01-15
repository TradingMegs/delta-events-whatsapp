# This Dockerfile expects to be run from the repo root
FROM python:3.11-slim

WORKDIR /app

# Copy requirements from the python-api folder
COPY python-api/requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the app code from the python-api folder
COPY python-api/app ./app

# Expose port
EXPOSE 8000

# Start command
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

FROM python:3.11-slim

WORKDIR /service

# Copy all files
COPY . .

# Move python-api files up if we are in root context
RUN if [ -d "python-api" ]; then cp -r python-api/* .; fi

# Verify app folder exists
RUN if [ ! -d "app" ]; then echo "STILL MISSING APP FOLDER"; ls -R; exit 1; fi

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose port
EXPOSE 8000

# Start command
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

FROM python:3.11-slim

WORKDIR /service

# Install dependencies FIRST (caching layer)
# Try both locations
COPY python-api/requirements.txt ./requirements-subdir.txt
COPY requirements.txt ./requirements-root.txt
RUN if [ -f requirements-subdir.txt ]; then \
    pip install --no-cache-dir -r requirements-subdir.txt; \
    else \
    pip install --no-cache-dir -r requirements-root.txt; \
    fi

# Explicitly copy the app folder
# We attempt to copy from both potential locations
COPY python-api/app ./python-api-app
COPY app ./root-app

# Move the correct one to /service/app
RUN if [ -d "python-api-app" ] && [ "$(ls -A python-api-app)" ]; then \
    mv python-api-app app; \
    elif [ -d "root-app" ] && [ "$(ls -A root-app)" ]; then \
    mv root-app app; \
    else \
    echo "FATAL: Could not find app code in either location"; \
    ls -la; \
    exit 1; \
    fi

# Clean up
RUN rm -rf python-api-app root-app requirements-*.txt

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

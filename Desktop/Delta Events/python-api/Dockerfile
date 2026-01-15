FROM python:3.11-slim

WORKDIR /service

# 1. Copy everything to a temporary location
COPY . /temp_loader

# 2. Universal Setup Script
# checks if we are running from root (finding python-api dir) or inside subdir
RUN if [ -d "/temp_loader/python-api/app" ]; then \
    echo "Found python-api/app (Running from Root)"; \
    cp -r /temp_loader/python-api/* /service/; \
    elif [ -d "/temp_loader/app" ]; then \
    echo "Found /app (Running from Subdir)"; \
    cp -r /temp_loader/* /service/; \
    else \
    echo "CRITICAL: Could not find 'app' folder. Listing context:"; \
    ls -R /temp_loader; \
    exit 1; \
    fi

# 3. Install Requirements
RUN pip install --no-cache-dir -r requirements.txt

# 4. Expose Port
EXPOSE 8000

# 5. Run (with debug verify)
CMD echo "Contents of /service:" && ls -la && uvicorn app.main:app --host 0.0.0.0 --port $PORT

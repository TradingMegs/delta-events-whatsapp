FROM python:3.11-slim

WORKDIR /build

# Copy everything from the build context
COPY . .

# Install dependencies
# We check both locations: root or python-api subfolder
RUN if [ -f "python-api/requirements.txt" ]; then \
    pip install --no-cache-dir -r python-api/requirements.txt; \
    mv python-api/* .; \
    else \
    pip install --no-cache-dir -r requirements.txt; \
    fi

# Now valid code should be in /build/app
# Expose port
EXPOSE 8000

# Start command - verify directory structure before starting
CMD ls -la && uvicorn app.main:app --host 0.0.0.0 --port $PORT

FROM python:3.11-slim

WORKDIR /app

# Copy everything first to see what's available (debug)
COPY . .

# Install dependencies (if requirements.txt is in root of build context)
RUN pip install --no-cache-dir -r requirements.txt

# Expose port
EXPOSE 8000

# Start command
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

FROM python:3.11-slim

WORKDIR /code

# Copy requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the app package
COPY app ./app

# Set python path to current directory
ENV PYTHONPATH=/code

# Expose port
EXPOSE 8000

# Start command
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

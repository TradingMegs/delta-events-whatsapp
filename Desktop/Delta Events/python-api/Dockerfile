FROM python:3.11-slim

WORKDIR /code

# Copy specific files we whitelisted
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the app folder (which is whitelisted)
COPY app ./app

# Set python path
ENV PYTHONPATH=/code

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

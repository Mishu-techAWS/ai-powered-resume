# Use a Python image
FROM python:3.10-slim

WORKDIR /app

# Install dependencies
RUN pip install --no-cache-dir --upgrade pip
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Pre-download the sentence transformer model to avoid runtime downloads
RUN python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')"

# Copy application code
COPY . .

# Command to run the application using python -m
CMD ["sh", "-c", "python -m uvicorn main:app --host 0.0.0.0 --port $PORT"]

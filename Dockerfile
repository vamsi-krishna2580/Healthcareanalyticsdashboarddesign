FROM python:3.10-slim

WORKDIR /app

# Copy backend
COPY app.py .
COPY requirements.txt .
COPY model ./model

# Copy frontend dist
COPY "electron -app/dist" ./dist

# Copy start script
COPY start.sh .

RUN pip install --no-cache-dir -r requirements.txt

RUN chmod +x start.sh

EXPOSE 5000
EXPOSE 3000

CMD ["./start.sh"]

# Operational Runbook: MoveMate Fleet Command

## 1. System Overview
The MoveMate Pro Fleet Backend manages real-time telematics from moving trucks, predicts remaining useful life (RUL) using an ML model, and generates RAG-based maintenance reports using LangChain.

## 2. Local Development Setup
```bash
# 1. Start the Next.js Frontend
cd movemate-pro
npm run dev

# 2. Start the FastAPI Backend
cd fleet-backend
python -m venv venv
# Activate venv (Windows: .\venv\Scripts\activate, Mac/Linux: source venv/bin/activate)
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# 3. Start the MQTT Simulator (in a new terminal)
cd fleet-backend
python mqtt_simulator.py
```

## 3. Incident Response Protocol
**Alert: "WebSocket Disconnected" on Frontend**
- **Symptom:** The Fleet Command dashboard shows a red "Disconnected" badge.
- **Action:** 
  1. Check if the FastAPI server (`uvicorn`) is running on port 8000.
  2. Check CORS policies in `main.py` if deployed to production.

**Alert: "Anomaly Agent Failed to Generate Report"**
- **Symptom:** Telemetry shows warnings, but no RAG report appears.
- **Action:**
  1. Verify the LLM API Key (OpenAI/Gemini) is injected into the environment.
  2. Check the Celery worker queue logs for failed async jobs.

## 4. API Documentation
FastAPI automatically generates the OpenAPI spec. 
When the server is running, navigate to: `http://localhost:8000/docs`

import asyncio
import json
import logging
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from typing import List

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="MoveMate Pro Fleet Backend", description="Predictive Maintenance Platform")

# Allow CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the Next.js URL (e.g., http://localhost:3000)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"Client connected. Total clients: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
        logger.info(f"Client disconnected. Total clients: {len(self.active_connections)}")

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except Exception as e:
                logger.error(f"Error sending message to client: {e}")

manager = ConnectionManager()

@app.get("/")
async def root():
    return {"message": "MoveMate Pro Fleet API is running."}

@app.websocket("/ws/fleet-data")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Keep the connection open and wait for messages from client (if any)
            data = await websocket.receive_text()
            logger.info(f"Received from client: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# A background task to simulate receiving MQTT data and pushing to WebSockets
# In a real setup, this would be triggered by paho-mqtt's on_message callback
async def mock_mqtt_listener():
    import random
    trucks = ["TRUCK-001", "TRUCK-002", "TRUCK-003"]
    while True:
        await asyncio.sleep(2)  # Simulate data arriving every 2 seconds
        
        # Simulate sensor readings
        data = {
            "truck_id": random.choice(trucks),
            "engine_temp": round(random.uniform(70.0, 105.0), 2), # Celsius
            "vibration_hz": round(random.uniform(10.0, 50.0), 2), # Hz
            "battery_current": round(random.uniform(11.5, 14.2), 2), # Volts
            "status": "normal"
        }
        
        # Simple threshold for anomaly (to be replaced by ML model)
        if data["engine_temp"] > 100.0 or data["vibration_hz"] > 45.0:
            data["status"] = "warning"
            
        await manager.broadcast(json.dumps(data))

@app.on_event("startup")
async def startup_event():
    # Start the background listener task
    asyncio.create_task(mock_mqtt_listener())
    logger.info("Started mock MQTT listener background task.")

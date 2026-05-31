import time
import json
import random
import paho.mqtt.client as mqtt

# Configuration
BROKER = "test.mosquitto.org" # Public broker for testing
PORT = 1883
TOPIC = "movemate/fleet/telematics"

def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Connected to MQTT Broker!")
    else:
        print(f"Failed to connect, return code {rc}")

client = mqtt.Client("MoveMate_Truck_Simulator")
client.on_connect = on_connect

print(f"Connecting to {BROKER}...")
try:
    client.connect(BROKER, PORT, 60)
except Exception as e:
    print(f"Connection failed: {e}")
    exit(1)

client.loop_start()

trucks = ["TRUCK-001", "TRUCK-002", "TRUCK-003"]

try:
    while True:
        # Simulate data for a random truck
        truck_id = random.choice(trucks)
        
        # Normal operating ranges with occasional spikes to simulate wear/tear
        temp_base = random.uniform(85.0, 95.0)
        vib_base = random.uniform(15.0, 25.0)
        
        # 5% chance of an anomaly spike
        if random.random() < 0.05:
            temp_base += random.uniform(10.0, 20.0)
            vib_base += random.uniform(20.0, 40.0)
            print(f"--- ANOMALY SPIKE ON {truck_id} ---")

        payload = {
            "truck_id": truck_id,
            "timestamp": int(time.time()),
            "sensors": {
                "temperature": round(temp_base, 2),
                "vibration": round(vib_base, 2),
                "current": round(random.uniform(12.0, 14.0), 2)
            }
        }
        
        msg = json.dumps(payload)
        client.publish(TOPIC, msg)
        print(f"Published: {msg}")
        
        time.sleep(2) # Publish every 2 seconds

except KeyboardInterrupt:
    print("\nDisconnecting from broker...")
    client.loop_stop()
    client.disconnect()
    print("Disconnected.")

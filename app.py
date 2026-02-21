from flask import Flask, request, jsonify
from math import radians, sin, cos, sqrt, atan2
import random
import time

app = Flask(__name__)

DISPATCH_API_KEY = "AURA_SECRET_123"

# Static hospital dataset (fully offline)
HOSPITALS = [
    {"id": 1, "name": "City Emergency Hospital", "lat": 12.9716, "lng": 77.5946, "capacity": 5},
    {"id": 2, "name": "Metro Trauma Center", "lat": 12.9750, "lng": 77.5920, "capacity": 3},
    {"id": 3, "name": "General Medical Institute", "lat": 12.9780, "lng": 77.5900, "capacity": 4}
]

def calculate_distance(lat1, lon1, lat2, lon2):
    R = 6371
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = sin(dlat/2)**2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon/2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    return R * c

@app.route("/dispatch", methods=["POST"])
def dispatch():
    api_key = request.headers.get("X-API-KEY")
    if api_key != DISPATCH_API_KEY:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.json
    user_lat = data["patient_location"]["lat"]
    user_lng = data["patient_location"]["lng"]
    severity = data.get("severity", 1)

    # Find nearest hospital
    nearest = min(
        HOSPITALS,
        key=lambda h: calculate_distance(user_lat, user_lng, h["lat"], h["lng"])
    )

    distance_km = calculate_distance(user_lat, user_lng, nearest["lat"], nearest["lng"])

    # Simulated ETA logic
    base_speed_kmph = 40
    eta_minutes = round((distance_km / base_speed_kmph) * 60)

    # Add emergency priority boost
    if severity >= 3:
        eta_minutes = max(2, eta_minutes - 2)

    # Simulate ambulance assignment
    ambulance_id = f"AMB-{random.randint(100,999)}"

    response = {
        "status": "DISPATCH_CONFIRMED",
        "ambulance_id": ambulance_id,
        "nearest_hospital": nearest["name"],
        "distance_km": round(distance_km, 2),
        "estimated_arrival_minutes": eta_minutes,
        "priority_level": severity,
        "timestamp": int(time.time())
    }

    return jsonify(response)

app.run(host="0.0.0.0", port=5000)

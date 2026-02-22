from flask import Flask, request, jsonify
from math import radians, sin, cos, sqrt, atan2
import random
import time
import os

app = Flask(__name__)

# 🔐 Optional API Key (if you want to secure dispatch)
DISPATCH_API_KEY = "AURA_SECRET_123"

# 🏥 Static hospital dataset
HOSPITALS = [
    {"id": 1, "name": "City Emergency Hospital", "lat": 12.9716, "lng": 77.5946, "capacity": 5},
    {"id": 2, "name": "Metro Trauma Center", "lat": 12.9750, "lng": 77.5920, "capacity": 3},
    {"id": 3, "name": "General Medical Institute", "lat": 12.9780, "lng": 77.5900, "capacity": 4}
]

# 📍 Distance calculator (Haversine formula)
def calculate_distance(lat1, lon1, lat2, lon2):
    R = 6371  # Earth radius in KM
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = sin(dlat/2)**2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon/2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    return R * c


@app.route("/")
def home():
    return jsonify({"message": "AURA Dispatch System Running"})


@app.route("/dispatch", methods=["POST"])
def dispatch():

    # Optional API key check
    api_key = request.headers.get("x-api-key")
    if api_key and api_key != DISPATCH_API_KEY:
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()

    # Validate input
    if not data or "patient_location" not in data:
        return jsonify({"error": "Invalid payload"}), 400

    try:
        user_lat = float(data["patient_location"]["lat"])
        user_lng = float(data["patient_location"]["lng"])
        severity = int(data.get("severity", 1))
    except (KeyError, ValueError, TypeError):
        return jsonify({"error": "Invalid location or severity format"}), 400

    # 🏥 Find nearest hospital
    nearest = min(
        HOSPITALS,
        key=lambda h: calculate_distance(user_lat, user_lng, h["lat"], h["lng"])
    )

    distance_km = calculate_distance(
        user_lat, user_lng, nearest["lat"], nearest["lng"]
    )

    # 🚑 ETA calculation
    base_speed_kmph = 40
    eta_minutes = round((distance_km / base_speed_kmph) * 60)

    # High severity → faster dispatch
    if severity >= 3:
        eta_minutes = max(2, eta_minutes - 2)

    ambulance_id = f"AMB-{random.randint(100,999)}"

    response = {
        "status": "DISPATCH_CONFIRMED",
        "ambulance_id": ambulance_id,
        "hospital": nearest["name"],
        "distance_km": round(distance_km, 2),
        "eta_minutes": eta_minutes,
        "priority_level": severity,
        "confidence": 1,
        "lat": user_lat,
        "lng": user_lng,
        "timestamp": int(time.time())
    }

    return jsonify(response), 200


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)

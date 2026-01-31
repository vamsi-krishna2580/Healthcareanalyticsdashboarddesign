from flask import Flask, request, jsonify
import joblib
import pandas as pd
from flask_cors import CORS
import warnings
import os
import sys
import math
import json
import random

warnings.filterwarnings("ignore")

def resource_path(relative_path):
    try:
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.abspath(".")
    return os.path.join(base_path, relative_path)

app = Flask(__name__)

# allow all origins for development
CORS(app, resources={r"/*": {"origins": "*"}})

# load trained model and scaler
model = joblib.load(resource_path("model/svm_diabetes_model.pkl"))
scaler = joblib.load(resource_path("model/scaler.pkl"))

FEATURE_NAMES = [
    "Pregnancies",
    "Glucose",
    "BloodPressure",
    "SkinThickness",
    "Insulin",
    "BMI",
    "DiabetesPedigreeFunction",
    "Age"
]

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json(force=True)
        if not data:
            return jsonify({"error": "No input data"}), 400

        print("\n=== Incoming request from frontend ===")
        print(json.dumps(data, indent=2))

        # gender logic
        gender = str(data.get("gender", "male")).lower()
        pregnancies = float(data.get("pregnancies", 0)) if gender == "female" else 0.0

        # clamp inputs to UI slider ranges
        glucose = max(0, min(200, float(data.get("glucose", 0))))
        blood_pressure = max(0, min(180, float(data.get("bloodPressure", 0))))
        skin_thickness = max(0, min(100, float(data.get("skinThickness", 0))))
        insulin = max(0, min(900, float(data.get("insulin", 0))))
        bmi = max(10, min(60, float(data.get("bmi", 10))))
        dpf = max(0.0, min(3.0, float(data.get("dpf", 0))))
        age = max(18, min(90, float(data.get("age", 18))))

        feature_values = [
            pregnancies,
            glucose,
            blood_pressure,
            skin_thickness,
            insulin,
            bmi,
            dpf,
            age
        ]

        print("Processed feature vector used for model:")
        for name, value in zip(FEATURE_NAMES, feature_values):
            print(f"  {name}: {value}")

        features = pd.DataFrame([feature_values], columns=FEATURE_NAMES)
        features_scaled = scaler.transform(features)

        prediction_class = model.predict(features_scaled)[0]

        if hasattr(model, "predict_proba"):
            prob = model.predict_proba(features_scaled)[0][1]
        else:
            decision = model.decision_function(features_scaled)[0]
            prob = 1 / (1 + math.exp(-decision))

        risk_score = round(prob * 100, 2)
        result_label = "High Risk" if prediction_class == 1 else "Low Risk"

        print(f"Prediction: {result_label}")
        print(f"Risk score: {risk_score}%")
        print("======================================\n")

        return jsonify({
            "prediction": result_label,
            "risk_score": risk_score,
            "probability": round(prob, 4)
        })

    except Exception as e:
        print("Error during prediction:", str(e))
        return jsonify({"error": "Prediction failed"}), 500


# 🔹 simple population stats endpoint (mock but backend-driven)
@app.route("/population-stats", methods=["GET"])
def population_stats():
    data = []

    # generate synthetic population consistent with Pima-style features
    for _ in range(500):
        age = random.randint(20, 80)
        bmi = round(random.uniform(18, 45), 1)
        glucose = random.randint(70, 200)
        bp = random.randint(60, 160)

        # simple heuristic for diabetes flag
        has_diabetes = (
            glucose > 140 or
            bmi > 32 or
            (age > 55 and glucose > 120)
        )

        data.append({
            "age": age,
            "bmi": bmi,
            "glucose": glucose,
            "bloodPressure": bp,
            "hasDiabetes": bool(has_diabetes)
        })

    return jsonify(data)


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "Backend running"}), 200


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=False)

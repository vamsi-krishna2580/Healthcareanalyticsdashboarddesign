from flask import Flask, request, jsonify
import joblib
import pandas as pd
from flask_cors import CORS
import warnings
import os
import sys
import math
import json

warnings.filterwarnings("ignore")

def resource_path(relative_path):
    try:
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.abspath(".")
    return os.path.join(base_path, relative_path)

app = Flask(__name__)

# allow all origins for development (frontend on localhost can call backend)
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

        # 🔹 Print raw input from frontend
        print("\n=== Incoming request from frontend ===")
        print(json.dumps(data, indent=2))

        # -------- Gender handling --------
        gender = str(data.get("gender", "male")).lower()

        if gender == "female":
            pregnancies = float(data.get("pregnancies", 0))
        else:
            pregnancies = 0.0

        # -------- Clamp inputs to UI ranges --------
        glucose = max(0, min(200, float(data.get("glucose", 0))))
        blood_pressure = max(0, min(180, float(data.get("bloodPressure", 0))))
        skin_thickness = max(0, min(100, float(data.get("skinThickness", 0))))
        insulin = max(0, min(900, float(data.get("insulin", 0))))
        bmi = max(10, min(60, float(data.get("bmi", 10))))
        dpf = max(0.0, min(3.0, float(data.get("dpf", 0))))
        age = max(18, min(90, float(data.get("age", 18))))

        # feature vector in correct order
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

        # 🔹 Print processed feature vector
        print("Processed feature vector used for model:")
        for name, value in zip(FEATURE_NAMES, feature_values):
            print(f"  {name}: {value}")

        features = pd.DataFrame([feature_values], columns=FEATURE_NAMES)

        # scale features
        features_scaled = scaler.transform(features)

        # prediction
        prediction_class = model.predict(features_scaled)[0]

        # probability of diabetes (class 1)
        if hasattr(model, "predict_proba"):
            prob = model.predict_proba(features_scaled)[0][1]
        else:
            decision = model.decision_function(features_scaled)[0]
            prob = 1 / (1 + math.exp(-decision))

        risk_score = round(prob * 100, 2)
        result_label = "High Risk" if prediction_class == 1 else "Low Risk"

        # 🔹 Print prediction output
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


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "Backend running"}), 200


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=False)

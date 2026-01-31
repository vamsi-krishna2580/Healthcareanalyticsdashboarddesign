from flask import Flask, request, jsonify
import joblib
import pandas as pd
from flask_cors import CORS
import warnings
import os
import sys
import math

warnings.filterwarnings("ignore")

def resource_path(relative_path):
    try:
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.abspath(".")
    return os.path.join(base_path, relative_path)

app = Flask(__name__)

# allow frontend dev server (vite) to access backend
CORS(app, resources={r"/*": {"origins": "*"}})

# load model and scaler
model = joblib.load(resource_path("model/svm_diabetes_model.pkl"))
scaler = joblib.load(resource_path("model/scaler.pkl"))

# exact Pima feature order used during training
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

        # -------- Gender handling ----------
        gender = str(data.get("gender", "male")).lower()

        if gender == "female":
            pregnancies = float(data.get("pregnancies", 0))
        else:
            # males or unspecified -> pregnancies not applicable
            pregnancies = 0.0

        # -------- Read and clamp inputs to UI slider ranges ----------
        glucose = max(0, min(200, float(data.get("glucose", 0))))
        blood_pressure = max(0, min(180, float(data.get("bloodPressure", 0))))
        skin_thickness = max(0, min(100, float(data.get("skinThickness", 0))))
        insulin = max(0, min(900, float(data.get("insulin", 0))))
        bmi = max(10, min(60, float(data.get("bmi", 10))))
        dpf = max(0.0, min(3.0, float(data.get("dpf", 0))))
        age = max(18, min(90, float(data.get("age", 18))))

        # -------- Build feature dataframe in exact training order ----------
        features = pd.DataFrame([[
            pregnancies,
            glucose,
            blood_pressure,
            skin_thickness,
            insulin,
            bmi,
            dpf,
            age
        ]], columns=FEATURE_NAMES)

        # -------- Scale features ----------
        features_scaled = scaler.transform(features)

        # -------- Prediction ----------
        prediction_class = model.predict(features_scaled)[0]

        # probability for positive class (diabetes = 1)
        if hasattr(model, "predict_proba"):
            prob = model.predict_proba(features_scaled)[0][1]
        else:
            # fallback if SVM trained without probability=True
            decision = model.decision_function(features_scaled)[0]
            prob = 1 / (1 + math.exp(-decision))  # sigmoid approx

        risk_score = round(prob * 100, 2)

        result_label = "High Risk" if prediction_class == 1 else "Low Risk"

        return jsonify({
            "prediction": result_label,
            "risk_score": risk_score,   # 0–100 for gauge
            "probability": round(prob, 4)  # optional raw probability 0–1
        })

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": "Prediction failed"}), 500


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "Backend running"}), 200


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=False)

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
from tensorflow.keras.models import load_model
from flaskCodeRag import rag_bp
import os

app = Flask(__name__)
CORS(app)

app.register_blueprint(rag_bp, url_prefix="/rag")

# Load trained objects
# lgmodel = joblib.load("model.pkl")
# lgscaler = joblib.load("scaler.pkl")
# lgencoder = joblib.load("encoder.pkl")
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(BASE_DIR, "mlModels", "nnmodel.h5")
SCALER_PATH = os.path.join(BASE_DIR, "mlModels", "nnscaler.pkl")
ENCODER_PATH = os.path.join(BASE_DIR, "mlModels", "nnencoder.pkl")

nnmodel = None
nnscaler = None
nnencoder = None

def load_assets():
    global nnmodel, nnscaler, nnencoder

    if nnmodel is not None:
        return

    print("Loading ML assets...")
    print("MODEL_PATH:", MODEL_PATH)
    print("Files in BASE_DIR:", os.listdir(BASE_DIR))

    ml_dir = os.path.join(BASE_DIR, "mlModels")
    print("mlModels exists:", os.path.exists(ml_dir))

    if not os.path.exists(ml_dir):
        raise FileNotFoundError("mlModels directory not found")

    print("mlModels contents:", os.listdir(ml_dir))

    nnmodel = load_model(MODEL_PATH)
    nnscaler = joblib.load(SCALER_PATH)
    nnencoder = joblib.load(ENCODER_PATH)

    print("ML assets loaded successfully")

@app.route("/health")
def health():
    return {"status": "ok"}

@app.route("/predict", methods=["POST"])
def predict():
    try:
        load_assets()

        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON"}), 400

        required = [
            "risk_comfort",
            "growth_preference",
            "loss_tolerance",
            "time_horizon",
            "income_stability",
        ]

        for key in required:
            if key not in data:
                return jsonify({"error": f"Missing field: {key}"}), 400

        features = np.array([[
            data["risk_comfort"],
            data["growth_preference"],
            data["loss_tolerance"],
            data["time_horizon"],
            data["income_stability"]
        ]])

        scaled_features = nnscaler.transform(features)
        prediction_probs = nnmodel.predict(scaled_features)

        predicted_class_index = np.argmax(prediction_probs, axis=1)
        risk_label = nnencoder.inverse_transform(predicted_class_index)[0]

        return jsonify({"risk_category": risk_label})

    except Exception as e:
        print("PREDICTION ERROR:")
        traceback.print_exc()
        return jsonify({"error": "ML prediction failed"}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port)

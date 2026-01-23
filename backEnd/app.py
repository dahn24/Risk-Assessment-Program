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

nnmodel = load_model(MODEL_PATH)
nnscaler = joblib.load(SCALER_PATH)
nnencoder = joblib.load(ENCODER_PATH)

@app.route("/health")
def health():
    return {"status": "ok"}

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    features = np.array([[
        data["risk_comfort"],
        data["growth_preference"],
        data["loss_tolerance"],
        data["time_horizon"],
        data["income_stability"]
    ]]).reshape(1, -1)

    scaled_features = nnscaler.transform(features)
    prediction_probs = nnmodel.predict(scaled_features)

    # 4. Convert probabilities to class index
    predicted_class_index = np.argmax(prediction_probs, axis=1)  # shape (1,)

    # 5. Map class index back to original label
    risk_label = nnencoder.inverse_transform(predicted_class_index)[0]

    return jsonify({"risk_category": risk_label})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port)

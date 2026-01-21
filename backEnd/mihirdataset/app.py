""" from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# Load trained objects
model = joblib.load("model.pkl")
scaler = joblib.load("scaler.pkl")
encoder = joblib.load("encoder.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    features = np.array([[
        data["risk_comfort"],
        data["growth_preference"],
        data["loss_tolerance"],
        data["time_horizon"],
        data["income_stability"]
    ]])

    scaled_features = scaler.transform(features)
    prediction = model.predict(scaled_features)


    risk_label = encoder.inverse_transform(prediction)[0]

    return jsonify({"risk_category": risk_label})

if __name__ == "__main__":
    app.run(port=5000, debug=True)
 """

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)

# Load trained objects
model = joblib.load("model.pkl")
scaler = joblib.load("scaler.pkl")
encoder = joblib.load("encoder.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    features = np.array([[
        data["risk_comfort"],
        data["growth_preference"],
        data["loss_tolerance"],
        data["time_horizon"],
        data["income_stability"]
    ]])

    scaled_features = scaler.transform(features)
    prediction = model.predict(scaled_features)

    risk_label = encoder.inverse_transform(prediction)[0]

    return jsonify({"risk_category": risk_label})

if __name__ == "__main__":
    app.run(port=5001, debug=True)

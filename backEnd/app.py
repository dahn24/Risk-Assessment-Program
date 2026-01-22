from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
from keras.models import load_model
from flaskCodeRag import rag_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(rag_bp, url_prefix="/rag")

# Load trained objects
# lgmodel = joblib.load("model.pkl")
# lgscaler = joblib.load("scaler.pkl")
# lgencoder = joblib.load("encoder.pkl")
nnmodel = load_model("mlModels/nnmodel.h5")
nnscaler = joblib.load("mlModels/nnscaler.pkl")
nnencoder = joblib.load("mlModels/nnencoder.pkl")

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
    app.run(port=5001, debug=True)

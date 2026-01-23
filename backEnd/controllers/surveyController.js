// surveyController.js
const axios = require("axios");
const UserInputs = require("../models/userInputs");

const PYTHON_API_URL = process.env.VITE_PYTHON_API_URL || "http://localhost:5001";

exports.submitSurvey = async (req, res) => {
  try {
    const {
      risk_comfort,
      growth_preference,
      loss_tolerance,
      time_horizon,
      income_stability,
      question
    } = req.body;


    let risk_category = null;

    // --- Retry logic for ML service ---
    const MAX_ATTEMPTS = 3;
    let attempts = 0;
    while (attempts < MAX_ATTEMPTS && !risk_category) {
      try {
        const mlResponse = await axios.post(
          `${PYTHON_API_URL}/predict`,
          {
            risk_comfort,
            growth_preference,
            loss_tolerance,
            time_horizon,
            income_stability
          },
          { timeout: 120000 } // 120s timeout per attempt
        );
        console.log("ML response data:", mlResponse.data);
        risk_category = mlResponse.data.risk_category; // stop retry if success
      } catch (err) {
        attempts++;
        console.warn(`ML attempt ${attempts} failed:`, err.message);

        // Wait 1 second before retry
        if (attempts < MAX_ATTEMPTS) {
          await new Promise(r => setTimeout(r, 1000));
        }
      }
    }

    const survey = await UserInputs.findOneAndUpdate(
      { email: req.body.email },
      {
        risk_comfort,
        growth_preference,
        loss_tolerance,
        time_horizon,
        income_stability,
        risk_category
      },
      { new: true, upsert: true }
    );

    // CHANGED: Call RAG endpoint using environment variable
    let ragData = null;
    try {
      const ragResponse = await axios.post(
        `${PYTHON_API_URL}/rag/ask`,  // CHANGED: replaced "http://127.0.0.1:5001/rag/ask"
        {
          email,
          question: "What is my risk profile?"
        },
        { timeout: 5000 } // CHANGED: added timeout
      );
      ragData = ragResponse.data;
    } catch (err) {
      console.warn("RAG service failed:", err.message); // CHANGED: warning instead of crash
    }

    res.status(201).json({
      success: true,
      survey,
      rag: ragData
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Survey submission failed" });
  }

};
exports.getUserSurvey = async (req, res) => {
  try {
    const { email } = req.params;
    const survey = await UserInputs.findOne({ email });
    if (!survey) {
      return res.status(404).json({ message: "No survey found" });
    }
    res.json({ survey });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch survey" });
  }
};
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


    let risk_category;
    try {
      const mlResponse = await axios.post(
        `${PYTHON_API_URL}/predict`,  // CHANGED: replaced "http://localhost:5001/predict"
        {
          risk_comfort,
          growth_preference,
          loss_tolerance,
          time_horizon,
          income_stability
        },
        { timeout: 15000 } // CHANGED: added timeout
      );
      console.log("ML response data:", mlResponse.data);
      risk_category = mlResponse.data.risk_category;

    } catch (err) {
      console.error("ML service call failed!");
      if (err.response) {
        console.error("Status:", err.response.status);
        console.error("Data:", err.response.data);
      } else if (err.request) {
        console.error("No response received:", err.request);
      } else {
        console.error("Error message:", err.message);
      }
      return res.status(500).json({ error: "ML service unavailable" });
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
// surveyController.js
const axios = require("axios");
const UserInputs = require("../models/userInputs");

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


    const mlResponse = await axios.post("http://localhost:5001/predict", {
      risk_comfort,
      growth_preference,
      loss_tolerance,
      time_horizon,
      income_stability
    });

    const risk_category = mlResponse.data.risk_category;


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

    const email = survey.email
    
    let ragData = null;
    try {
      const ragResponse = await axios.post("http://127.0.0.1:5001/rag/ask", {
        email,                 
        question: "What is my risk profile?" 
      });
      ragData = ragResponse.data; 
    } catch (err) {
      console.warn("RAG service failed:", err.message); 
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
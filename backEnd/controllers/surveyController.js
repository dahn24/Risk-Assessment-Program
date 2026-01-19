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
      income_stability
    } = req.body;

  
    const mlResponse = await axios.post("http://localhost:5001/predict", {
      risk_comfort,
      growth_preference,
      loss_tolerance,
      time_horizon,
      income_stability
    });

    const risk_category = mlResponse.data.risk_category;


    const survey = await UserInputs.create({
      risk_comfort,
      growth_preference,
      loss_tolerance,
      time_horizon,
      income_stability,
      risk_category
    });

    res.status(201).json({
      success: true,
      survey
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Survey submission failed" });
  }
};

const mongoose = require("mongoose");

const inputSchema = new mongoose.Schema({
    risk_comfort: { type: Number, required: true },
    growth_preference: { type: Number, required: true },
    loss_tolerance: { type: Number, required: true },
    time_horizon: { type: Number, required: true },
    income_stability: { type: Number, required: true },
    risk_category: { type: String, required: true },
});

const userInputs = mongoose.model("UserInputs", inputSchema);
module.exports = userInputs;

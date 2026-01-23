const express = require("express");
require("dotenv").config();
const cors = require("cors");
const connectDB = require("./db");  // <- new file
const routes = require("./routes/routes");

const app = express();
app.use(cors());
app.use(express.json());
console.log("MONGO_URI:", process.env.MONGO_URI);
connectDB(); // connect to Atlas

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`, req.body);
  next();
});

app.use("/api/survey", routes);

app.use((err, req, res, next) => {
  console.error("=== SERVER ERROR ===");
  console.error("URL:", req.originalUrl);
  console.error("Method:", req.method);
  console.error("Body:", req.body);
  console.error("Error stack:", err.stack || err);
  console.error("===================");
  res.status(500).json({ error: err.message || "Internal server error" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
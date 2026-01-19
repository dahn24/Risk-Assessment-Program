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

app.use("/api/survey", routes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
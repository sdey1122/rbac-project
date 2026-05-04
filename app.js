require("dotenv").config();
const express = require("express");
const connectDB = require("./app/config/db");

const app = express();

connectDB();

app.use(express.json());

app.use("/api/v1", require("./app/routes"));

app.get("/", (req, res) => {
  res.send("API Is Running...");
});

const PORT = process.env.PORT || 6789;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

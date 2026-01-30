require("dotenv").config();  
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

connectDB();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/", (req, res) => {
  res.send("HEllo World");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running : ${PORT}`);
});

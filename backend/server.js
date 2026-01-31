require("dotenv").config();  
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes")

connectDB();

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/auth',userRoutes)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running : ${PORT}`);
});

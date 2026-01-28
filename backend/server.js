const express = require("express");
const cors = require("cors");
const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/", (req, res) => {
  res.send("HEllo World");
});

app.listen(PORT, () => {
  console.log(`Server is running : ${PORT}`);
});

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
// const userValidation = require("../controllers/user/user.validator");
const feedback_route = require("./route/feedback-router");

// const url = "mongodb://localhost:27017/feedback";
const url = process.env.DATABASEURL;
// console.log(url);
const port = process.env.PORT || 3000;
console.log(port);
mongoose.connect(url, { useNewUrlParser: true });

const con = mongoose.connection;

try {
  con.on("open", () => {
    console.log("connected");
  });
} catch (error) {
  console.log("Error: " + error);
}

const app = express();

// app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api", feedback_route);
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  })
);
app.listen(port, () => {
  console.log("Server started");
});

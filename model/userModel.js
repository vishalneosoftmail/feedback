const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = mongoose.Schema({
  user_name: {
    type: String,
    required: true,
  },
  user_email: {
    type: String,
    required: true,
  },
  profile_pic: {
    type: String,
    required: true,
  },
  user_password: {
    type: String,
    required: true,
  },
  user_token: {
    type: String,
  },
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;

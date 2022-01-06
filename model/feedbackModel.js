const mongoose = require("mongoose");

const feedbackSchema = mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  feedback: {
    type: String,
    required: true,
  },
});

const feedbackModel = mongoose.model("feedback", feedbackSchema);

module.exports = feedbackModel;

const express = require("express");
const multer = require("multer");
const feedback_cntrl = require("../controller/feedbackCntrl");
const { validateUser } = require("../model/userModel");
const auth = require("../middleware/auth");
const {
  userValidation,
  loginValidation,
  getFeedbackValidation,
} = require("../middleware/validateMiddleware");

const upload = multer({
  dest: "public/img/",
});

const router = express.Router();

router.post(
  "/register",

  upload.single("profile_pic"),
  // [validateMiddleWare(validateUser)],
  userValidation,
  feedback_cntrl.createUser
);

router.post("/login", loginValidation, feedback_cntrl.loginUser);
router.get("/dashboard", auth, feedback_cntrl.dashboard);

//send feedback
router.post("/feedback", auth, feedback_cntrl.sendFeedback);
//get feedbacks
router.get(
  "/feedback",
  auth,
  getFeedbackValidation,
  feedback_cntrl.getFeedback
);

module.exports = router;

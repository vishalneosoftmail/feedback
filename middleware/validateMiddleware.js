// validateMiddleware

const joi = require("joi");

const validation = joi.object({
  user_name: joi.string().required(),
  user_email: joi.string().email().min(5).max(500).required(),
  // user_password: Joi.string().min(8).max(1024).required(),
  // profile_pic: Joi.string().required(),
});

const userValidation = async (req, res, next) => {
  const payload = {
    user_name: req.body.user_name,
    user_email: req.body.user_email,
  };
  const { error } = validation.validate(payload);
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  } else {
    next();
  }
};

//login
const validation_login = joi.object({
  user_email: joi.string().email().min(5).max(500).required(),
  user_password: joi.string().max(1024).required(),
});
const loginValidation = async (req, res, next) => {
  const payload = {
    user_email: req.body.user_email,
    user_password: req.body.user_password,
  };
  const { error } = validation_login.validate(payload);
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  } else {
    next();
  }
};

//send feedback
const validation_feedback = joi.object({
  user_id: joi.string().required(),
  feedback: joi.string().required(),
});

const feedbackValidation = (req, res, next) => {
  const payload = {
    user_id: req.body.user_id,
    feedback: req.body.feedback,
  };
  const { error } = validation_feedback.validate(payload);
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  } else {
    next();
  }
};

//get feedback
const validation_get_feedback = joi.object({
  user_id: joi.string().required(),
});

const getFeedbackValidation = (req, res, next) => {
  const payload = {
    user_id: req.body.user_id,
  };
  const { error } = validation_get_feedback.validate(payload);
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  } else {
    next();
  }
};

module.exports = {
  userValidation,
  loginValidation,
  feedbackValidation,
  getFeedbackValidation,
};

// module.exports = (validator) => {
//   return (req, res, next) => {
//     const { error } = validator(req.body);
//     console.log("error: ", error);
//     if (error) {
//       return res.status(400).send(error.details[0].message);
//     }
//     next();
//   };
// };

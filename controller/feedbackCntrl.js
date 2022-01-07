const mongoose = require("mongoose");
const randomstring = require("randomstring");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const jwt = require("jsonwebtoken");
const userModel = require("../model/userModel.js");
const feedbackModel = require("../model/feedbackModel.js");

const getUsers = async (req, res) => {
  try {
    const emp = await userModel.find();

    res.status(200).json({ success: true, emp });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const createUser = async (req, res) => {
  const newpassword = randomstring.generate(7);

  // generate salt to hash password
  const salt = await bcrypt.genSalt(10);
  // now we set user password to hashed password

  try {
    // await uploadFile(req, res);
    const newUser = new userModel({
      user_name: req.body.user_name,
      user_email: req.body.user_email,
      profile_pic: req.file.originalname,
      user_password: await bcrypt.hash(newpassword, salt),
      // user_password: newpassword,
    });
    const transporter = nodemailer.createTransport({
      port: 465,
      host: "smtp.gmail.com",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.KEY,
      },
      secure: true, // upgrades later with STARTTLS -- change this based on the PORT
    });

    // // send mail with defined transport object
    let info = transporter.sendMail(
      {
        from: process.env.EMAIL,
        to: req.body.user_email,
        subject: "Credentials",
        text: `text`,
        html: `<b>Hey there! </b><br> This is your login credentials. 
        Username: ${req.body.user_email} 
         Password: ${newpassword}<br/> `,
      },
      (error, info) => {
        if (error) {
          return console.log(error);
        }
        res
          .status(200)
          .send({ message: "Mail send", message_id: info.messageId });
      }
    );
    // nodemailer.getTestMessageUrl(info);

    const token = jwt.sign(
      { user_id: newUser._id, email: newUser.user_email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "5h",
      }
    );
    // save user token
    // console.log(token);
    newUser.user_token = token;

    await newUser.save();

    res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//login
const loginUser = async (req, res) => {
  try {
    const user = await userModel.findOne({ user_email: req.body.user_email });
    // console.log(req.body.user_password);
    console.log(user.user_password);
    //  let enpass = bcrypt.compareSync(req.body.user_password, user.password);
    //  console.log(enpass);
    if (
      user &&
      (await bcrypt.compare(req.body.user_password, user.user_password))
    ) {
      // if (user && req.body.user_password == user.user_password) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email: req.body.user_email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      // save user token
      user.user_token = token;

      // user
      res.status(200).json({ success: true, user });
    }
    res.status(400).json({ success: true, message: "Invalid Credentials" });

    // res.status(200).send("Welcome 🙌 ");
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//dashboard
const dashboard = async (req, res) => {
  try {
    let users = await userModel.aggregate([{ $sample: { size: 3 } }]);
    // console.log(users);
    res.status(200).json({ success: true, users: users });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const sendFeedback = async (req, res) => {
  try {
    const newFeedback = new feedbackModel({
      // user_id: req.body.user_id,
      sender_id: req.body.sender_id,
      recevier_id: req.body.recevier_id,
      feedback: req.body.feedback,
    });
    await newFeedback.save();

    res
      .status(200)
      .json({ success: true, message: "Feedbaack send successfully!!" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getFeedback = async (req, res) => {
  try {
    const allFeedback = await feedbackModel.find(
      // { user_id: req.body.user_id },
      { recevier_id: req.body.user_id },
      "feedback"
    );
    res.status(200).json({ success: true, feedback: allFeedback });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  createUser,
  loginUser,
  dashboard,
  sendFeedback,
  getFeedback,
};

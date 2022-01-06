const mongoose = require("mongoose");
const randomstring = require("randomstring");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const userModel = require("../model/userModel.js");
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
  const newUser = new userModel({
    user_name: req.body.user_name,
    user_email: req.body.user_email,
    profile_pic: req.file.originalname,
    user_password: bcrypt.hash(newpassword, 10),
  });

  try {
    // await uploadFile(req, res);
    await newUser.save();

    let transporter = nodemailer.createTransport({
      host: "localhost",
      port: 9000,
      secure: false, // true for 465, false for other ports
      // auth: {
      //   user: testAccount.user, // generated ethereal user
      //   pass: testAccount.pass, // generated ethereal password
      // },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: "pradeep.kumar@neosoftmail.com", // sender address
      to: "vishal.rangari@neosoftmail.com", // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: "<b>Hello world?</b>", // html body
    });
    nodemailer.getTestMessageUrl(info);

    res.status(201).json({ success: true, newUser });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
module.exports = {
  createUser,
};

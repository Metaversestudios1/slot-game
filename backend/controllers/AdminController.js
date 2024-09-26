const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");
const { find, findOne } = require("../models/Game");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const insertadmin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);

    const newadmin = new Admin({
      password: hashedpassword,
      username: username,
    });

    await newadmin.save();
    res.status(201).json({ success: true });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "error in inserting admin",
        error: err.message,
      });
  }
};
const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return res
        .status(404)
        .json({ sucess: false, message: "please provide all fields" });
    }
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res
        .status(404)
        .json({ sucess: false, message: "Admin not found" });
    }
    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return res
        .status(404)
        .json({ sucess: false, message: "Password does not match" });
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const options = {
      expires: new Date(Date.now() + 2592000000), // 30 days
      httpOnly: true,
      sameSite: "None",
      secure: true, // Important if you're using sameSite: "None"
    };
    res.cookie("token", token, options).json({
      success: true,
      token,
      admin,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error: " + err.message });
  }
};
const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "None",
    secure: true, // ensure this matches the cookie setting in login
  });
  res.status(200).json({ status: true, message: "Successfully logged out" });
};

module.exports = {
  insertadmin,
  login,
  logout,
};

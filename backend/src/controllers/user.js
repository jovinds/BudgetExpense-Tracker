const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// signing up
const signup = async (req, res) => {
  const { firstName, lastName, userName, password } = req.body;

  try {
    const duplicate = await User.findOne({ userName });
    // check if the username is already in use
    if (duplicate) {
      return res.status(400).json({ error: "Username is not available" });
    }
    // hashing password for 1 salt rounds
    const hashedPassword = await bcrypt.hash(password, 10);

    // create new user
    const newUser = await User.create({
      firstName,
      lastName,
      userName,
      password: hashedPassword,
    });

    res.status(200).json({ newUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { userName, password } = req.body;

  try {
    const duplicate = await User.findOne({ userName });
    // check for Username if exist in DB
    if (!duplicate) {
      return res.status(400).json({ error: "Username not found" });
    }
    // check if the password matches
    const isPasswordMatched = await bcrypt.compare(
      password,
      duplicate.password
    );

    if (!isPasswordMatched) {
      return res.status(400).json({ error: "Incorrect Password" });
    }
    const token = jwt.sign({ userId: duplicate._id }, process.env.JWT_SECRET);
    res.status(200).json({ userId: duplicate._id, userName, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const userInfo = await User.findOne({ _id: userId }).select(
      "firstName lastName"
    );
    if (!userInfo) {
      res.status(400).json({ message: "no user found" });
    }
    res.status(200).json(userInfo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  signup,
  login,
  getUser,
};
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  userName: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const db = mongoose.connection.useDb("expenseTracker_db");
const User = db.model("User", userSchema);

module.exports = User;



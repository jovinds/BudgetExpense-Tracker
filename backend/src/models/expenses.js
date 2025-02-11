const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  UserID: { type: String, required: true },
  CategoryID: { type: String, required: true },
  Note: { type: String, required: true },
  Price: { type: Number, required: true },
});

const db = mongoose.connection.useDb("expenseTracker_db");
const Expenses = db.model("Expenses", userSchema);

module.exports = Expenses;

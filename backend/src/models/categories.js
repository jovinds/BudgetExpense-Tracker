const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  UserID: { type: String, required: true },
  CategoryName: { type: String, required: true },
  Budget: { type: Number, required: true },
});

const db = mongoose.connection.useDb("expenseTracker_db");
const Categories = db.model("Categories", userSchema);

module.exports = Categories;

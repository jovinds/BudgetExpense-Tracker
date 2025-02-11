const Expenses = require("../models/expenses");

const createExpense = async (req, res) => {
  const catId = req.params.categoryId;
  const { UserID, Note, Price } = req.body;

  try {
    const newExpense = await Expenses.create({
      UserID,
      CategoryID: catId,
      Note,
      Price,
    });

    res.status(200).json({ newExpense });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// get expenses based on categoryID
const getExpensesCategoyId = async (req, res) => {
  const catId = req.params.categoryId;

  try {
    const expenses = await Expenses.find({ CategoryID: catId });
    if (!expenses) return res.status(404).json({ error: "No category found!" });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// get expenses based on UserID
const getExpensesUserId = async (req, res) => {
  const userId = req.params.userId;

  try {
    const expenses = await Expenses.find({ UserID: userId });
    if (!expenses) return res.status(404).json({ error: "No category found!" });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateExpense = async (req, res) => {
  const id = req.params.expenseId;
  try {
    const expense = await Expenses.findByIdAndUpdate(
      { _id: id },
      { ...req.body },
      { new: true, runValidators: true }
    );
    if (!expense) return res.status(404).json({ error: "Expense not found!" });

    res.status(200).json({
      message: "The Expense has been updated successfully!",
      expense,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//delete one expense based on expenseID
const deleteExpense = async (req, res) => {
  const id = req.params.expenseId;
  try {
    const expense = await Expenses.findByIdAndDelete({ _id: id });

    if (!expense) return res.status(404).json({ error: "No expense found!" });

    res.status(200).json({ message: "The expense has been removed" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteExpenseByCategoryId = async (req, res) => {
  const id = req.params.categoryId;
  try {
    const expense = await Expenses.deleteMany({ CategoryID: id });

    if (!expense) return res.status(404).json({ error: "No expenses found!" });

    res.status(200).json({ message: "The expenses has been removed" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createExpense,
  getExpensesCategoyId,
  getExpensesUserId,
  updateExpense,
  deleteExpense,
  deleteExpenseByCategoryId,
};

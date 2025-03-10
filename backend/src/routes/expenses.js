const express = require("express");
const router = express.Router();
const {
  createExpense,
  getExpensesUserId,
  getExpensesCategoyId,
  updateExpense,
  deleteExpense,
  deleteExpenseByCategoryId,
} = require("../controllers/expenses");

const { authMiddleware } = require("../middleware/authMiddleWare");

router.post("/:categoryId", createExpense);
router.get("/category/:categoryId", getExpensesCategoyId);
router.get("/:userId", getExpensesUserId);
router.put("/:expenseId", updateExpense);
router.delete("/:expenseId", deleteExpense);
router.delete("/category/:categoryId", deleteExpenseByCategoryId);

module.exports = router;

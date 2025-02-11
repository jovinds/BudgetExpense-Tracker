const express = require("express");
const router = express.Router();
const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/categories");

router.post("/:userId", createCategory);
router.get("/:userId", getCategories);
router.put("/:categoryId", updateCategory);
router.delete("/:categoryId", deleteCategory);

module.exports = router;

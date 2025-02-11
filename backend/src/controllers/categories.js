const Categories = require("../models/categories");

const createCategory = async (req, res) => {
  const userId = req.params.userId;
  const { CategoryName, Budget } = req.body;

  try {
    const newCategory = await Categories.create({
      UserID: userId,
      CategoryName,
      Budget,
    });

    res.status(200).json({ newCategory });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getCategories = async (req, res) => {
  const userId = req.params.userId;

  try {
    const categories = await Categories.find({ UserID: userId });
    if (!categories)
      return res.status(404).json({ error: "No category found!" });
    res.status(200).json(categories);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateCategory = async (req, res) => {
  const id = req.params.categoryId;
  try {
    const category = await Categories.findByIdAndUpdate(
      { _id: id },
      { ...req.body },
      { new: true, runValidators: true }
    );
    if (!category)
      return res.status(404).json({ error: "Category not found!" });

    res.status(200).json({
      message: "The Category has been updated successfully!",
      category,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  const id = req.params.categoryId;
  try {
    const category = await Categories.findByIdAndDelete({ _id: id });

    if (!category) return res.status(404).json({ error: "No category found!" });

    res.status(200).json({ message: "The category has been removed" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};

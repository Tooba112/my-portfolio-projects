const Category = require("../models/Category");

// GET /api/categories — Public: get all categories
const getCategories = async (req, res) => {
  try {
    // Only return documents that have a non-empty name
    const categories = await Category.find(
      { name: { $exists: true, $ne: null, $ne: "" } }
    ).sort({ name: 1 });

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/categories — Admin: create a category
const createCategory = async (req, res) => {
  try {
    const name = (req.body.name || "").trim();

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    // Case-insensitive duplicate check
    const exists = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") }
    });
    if (exists) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await Category.create({ name });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/categories/:id — Admin: delete a category
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCategories,
  createCategory,
  deleteCategory
};

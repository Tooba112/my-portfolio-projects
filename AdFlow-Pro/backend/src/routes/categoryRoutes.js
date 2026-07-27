const express = require("express");
const protect = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const {
  getCategories,
  createCategory,
  deleteCategory
} = require("../controllers/categoryController");

const router = express.Router();

// Public
router.get("/", getCategories);

// Admin only
router.post("/", protect, roleMiddleware("admin"), createCategory);
router.delete("/:id", protect, roleMiddleware("admin"), deleteCategory);

module.exports = router;

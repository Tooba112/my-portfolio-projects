const express = require("express");
const protect = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const {
  getUsers,
  getProfile,
  updateUserRole,
  deleteUser
} = require("../controllers/userController");

const router = express.Router();

// Authenticated user
router.get("/profile", protect, getProfile);

// Admin only
router.get("/", protect, roleMiddleware("admin"), getUsers);
router.put("/:id/role", protect, roleMiddleware("admin"), updateUserRole);
router.delete("/:id", protect, roleMiddleware("admin"), deleteUser);

module.exports = router;

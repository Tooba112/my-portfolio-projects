const express = require("express");
const protect = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const {
  createGig,
  getGigs,
  getMyGigs,
  getPendingGigs,
  getGigById,
  approveGig,
  rejectGig,
  deleteGig
} = require("../controllers/gigController");

const router = express.Router();

// Public
router.get("/", getGigs);
router.get("/:id", getGigById);

// Provider
router.post("/", protect, roleMiddleware("provider"), createGig);
router.get("/provider/my", protect, roleMiddleware("provider"), getMyGigs);
router.delete("/:id", protect, roleMiddleware("provider"), deleteGig);

// Moderator
router.get("/moderation/pending", protect, roleMiddleware("moderator", "admin"), getPendingGigs);
router.put("/:id/approve", protect, roleMiddleware("moderator", "admin"), approveGig);
router.put("/:id/reject", protect, roleMiddleware("moderator", "admin"), rejectGig);

module.exports = router;

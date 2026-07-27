const express = require("express");
const protect = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const {
  createReview,
  getAllReviews,
  getProviderReviews
} = require("../controllers/reviewController");

const router = express.Router();

// Public
router.get("/", getAllReviews);
router.get("/provider/:id", getProviderReviews);

// Client only
router.post("/", protect, roleMiddleware("client"), createReview);

module.exports = router;

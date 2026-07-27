const express = require("express");
const protect = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const {
  createPayment,
  getAllPayments,
  getMyPayments,
  verifyPayment
} = require("../controllers/paymentController");

const router = express.Router();

// Client
router.post("/", protect, roleMiddleware("client"), createPayment);
router.get("/my", protect, roleMiddleware("client"), getMyPayments);

// Admin
router.get("/", protect, roleMiddleware("admin"), getAllPayments);
router.put("/:id/verify", protect, roleMiddleware("admin"), verifyPayment);

module.exports = router;

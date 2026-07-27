const express = require("express");
const protect = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const {
  createOrder,
  getMyOrders,
  getProviderOrders,
  getAllOrders,
  completeOrder
} = require("../controllers/orderController");

const router = express.Router();

// Client
router.post("/", protect, roleMiddleware("client"), createOrder);
router.get("/my", protect, roleMiddleware("client"), getMyOrders);

// Provider
router.get("/provider", protect, roleMiddleware("provider"), getProviderOrders);
router.put("/:id/complete", protect, roleMiddleware("provider"), completeOrder);

// Admin
router.get("/", protect, roleMiddleware("admin"), getAllOrders);

module.exports = router;

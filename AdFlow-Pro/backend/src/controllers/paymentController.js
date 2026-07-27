const Payment = require("../models/Payment");
const Order = require("../models/Order");

// POST /api/payments — Client submits payment for an order
const createPayment = async (req, res) => {
  try {
    const { orderId, amount, paymentMethod } = req.body;

    if (!orderId || !amount || !paymentMethod) {
      return res.status(400).json({ message: "orderId, amount, and paymentMethod are required" });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to pay for this order" });
    }

    const payment = await Payment.create({
      order: orderId,
      client: req.user._id,
      amount,
      paymentMethod,
      status: "pending"
    });

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/payments — Admin: get all payments
const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("order")
      .populate("client", "name email")
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/payments/my — Client: get their own payments
const getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ client: req.user._id })
      .populate("order")
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/payments/:id/verify — Admin verifies a payment
const verifyPayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status: "verified" },
      { new: true }
    );
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    // Also update the associated order status to active
    await Order.findByIdAndUpdate(payment.order, { status: "active" });

    res.json({ message: "Payment verified", payment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPayment,
  getAllPayments,
  getMyPayments,
  verifyPayment
};

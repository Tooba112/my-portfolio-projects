const Order = require("../models/Order");
const Gig = require("../models/Gig");

// POST /api/orders — Client places an order
const createOrder = async (req, res) => {
  try {
    const { gigId } = req.body;

    if (!gigId) {
      return res.status(400).json({ message: "Gig ID is required" });
    }

    const gig = await Gig.findById(gigId);
    if (!gig) return res.status(404).json({ message: "Gig not found" });
    if (gig.status !== "approved") {
      return res.status(400).json({ message: "Gig is not available for ordering" });
    }

    const order = await Order.create({
      client: req.user._id,
      provider: gig.provider,
      gig: gig._id,
      amount: gig.price,
      status: "pending"
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/orders/my — Client: get their own orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ client: req.user._id })
      .populate("gig", "title price")
      .populate("provider", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/orders/provider — Provider: get orders for their gigs
const getProviderOrders = async (req, res) => {
  try {
    const orders = await Order.find({ provider: req.user._id })
      .populate("gig", "title price")
      .populate("client", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/orders — Admin: get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("gig", "title price")
      .populate("client", "name email")
      .populate("provider", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/orders/:id/complete — Provider marks order as completed
const completeOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    order.status = "completed";
    await order.save();
    res.json({ message: "Order marked as completed", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getProviderOrders,
  getAllOrders,
  completeOrder
};

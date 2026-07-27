const Review = require("../models/Review");
const Order = require("../models/Order");

// POST /api/reviews — Client submits a review after a completed order
const createReview = async (req, res) => {
  try {
    const { providerId, gigId, rating, comment } = req.body;

    if (!providerId || !rating || !comment) {
      return res.status(400).json({ message: "providerId, rating, and comment are required" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const review = await Review.create({
      client: req.user._id,
      provider: providerId,
      gig: gigId || null,
      rating,
      comment
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/reviews — Get all reviews (public or admin)
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("client", "name")
      .populate("provider", "name")
      .populate("gig", "title")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/reviews/provider/:id — Get reviews for a specific provider
const getProviderReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ provider: req.params.id })
      .populate("client", "name")
      .populate("gig", "title")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReview,
  getAllReviews,
  getProviderReviews
};

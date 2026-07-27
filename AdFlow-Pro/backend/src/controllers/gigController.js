const Gig = require("../models/Gig");
const Category = require("../models/Category");

// POST /api/gigs — Provider creates a gig (status: pending for moderation)
const createGig = async (req, res) => {
  try {
    const { title, description, price, category } = req.body;

    if (!title || !description || !price || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const gig = await Gig.create({
      title,
      description,
      price,
      category,
      provider: req.user._id,
      status: "pending"
    });

    res.status(201).json(gig);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/gigs — Public: get all approved gigs (with optional category filter)
const getGigs = async (req, res) => {
  try {
    const filter = { status: "approved" };
    if (req.query.category) {
      filter.category = req.query.category;
    }

    const gigs = await Gig.find(filter)
      .populate("provider", "name email")
      .sort({ createdAt: -1 });

    res.json(gigs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/gigs/my — Provider: get their own gigs
const getMyGigs = async (req, res) => {
  try {
    const gigs = await Gig.find({ provider: req.user._id }).sort({ createdAt: -1 });
    res.json(gigs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/gigs/pending — Moderator: get all pending gigs
const getPendingGigs = async (req, res) => {
  try {
    const gigs = await Gig.find({ status: "pending" })
      .populate("provider", "name email")
      .sort({ createdAt: -1 });
    res.json(gigs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/gigs/:id — Get single gig
const getGigById = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id).populate("provider", "name email");
    if (!gig) return res.status(404).json({ message: "Gig not found" });
    res.json(gig);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/gigs/:id/approve — Moderator approves a gig
const approveGig = async (req, res) => {
  try {
    const gig = await Gig.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );
    if (!gig) return res.status(404).json({ message: "Gig not found" });
    res.json({ message: "Gig approved", gig });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/gigs/:id/reject — Moderator rejects a gig
const rejectGig = async (req, res) => {
  try {
    const gig = await Gig.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );
    if (!gig) return res.status(404).json({ message: "Gig not found" });
    res.json({ message: "Gig rejected", gig });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/gigs/:id — Provider deletes their own gig
const deleteGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ message: "Gig not found" });

    if (gig.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this gig" });
    }

    await gig.deleteOne();
    res.json({ message: "Gig deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createGig,
  getGigs,
  getMyGigs,
  getPendingGigs,
  getGigById,
  approveGig,
  rejectGig,
  deleteGig
};

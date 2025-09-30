// server/controllers/contractorController.js
const Contractor = require("../models/Contractor");

// Create contractor profile (only once)
exports.createContractor = async (req, res) => {
  try {
    const existing = await Contractor.findOne({ user: req.user.id });
    if (existing) {
      return res.status(400).json({ message: "Profile already exists" });
    }

    let services = [];
    if (Array.isArray(req.body.services)) {
      services = req.body.services.map((s) => s.trim());
    } else if (typeof req.body.services === "string") {
      services = req.body.services.split(",").map((s) => s.trim());
    }

    const contractor = new Contractor({
      user: req.user.id,
      companyName: req.body.companyName,
      services,
      location: req.body.location || {},
      experience: req.body.experience,
      phone: req.body.phone,
      bio: req.body.bio,
      availability: req.body.availability,
    });

    await contractor.save();
    res.status(201).json(contractor);
  } catch (err) {
    console.error("❌ Create contractor error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Update contractor profile
exports.updateContractor = async (req, res) => {
  try {
    let updateData = { ...req.body };
    if (updateData.services) {
      if (Array.isArray(updateData.services)) {
        updateData.services = updateData.services.map((s) => s.trim());
      } else if (typeof updateData.services === "string") {
        updateData.services = updateData.services.split(",").map((s) => s.trim());
      }
    }

    const contractor = await Contractor.findOneAndUpdate(
      { user: req.user.id },
      { $set: updateData },
      { new: true }
    );

    if (!contractor) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(contractor);
  } catch (err) {
    console.error("❌ Update contractor error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete contractor profile
exports.deleteContractor = async (req, res) => {
  try {
    const contractor = await Contractor.findOneAndDelete({ user: req.user.id });
    if (!contractor) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json({ message: "Profile deleted successfully" });
  } catch (err) {
    console.error("❌ Delete contractor error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Get contractor profile by user ID (for contractor dashboard)
exports.getContractorByUserId = async (req, res) => {
  try {
    const contractor = await Contractor.findOne({ user: req.params.userId });
    if (!contractor) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json(contractor);
  } catch (err) {
    console.error("❌ Get contractor error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 NEW: Get contractor by contractor ID (Public Profile)
exports.getContractorById = async (req, res) => {
  try {
    const contractor = await Contractor.findById(req.params.id)
      .populate("user", "name email"); // pull name + email from User

    if (!contractor) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(contractor);
  } catch (err) {
    console.error("❌ Get contractor by ID error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Public search contractors
exports.searchContractors = async (req, res) => {
  try {
    const { city, service, q, page = 1, limit = 12 } = req.query;
    const query = {};

    if (q) {
      const regex = { $regex: q, $options: "i" };
      query.$or = [
        { companyName: regex },
        { bio: regex },
        { "location.city": regex },
        { "location.state": regex },
        { services: regex },
      ];
    }

    if (city) {
      query["location.city"] = { $regex: city, $options: "i" };
    }

    if (service) {
      query.services = { $regex: service, $options: "i" };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      Contractor.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate("user", "name email") // include contractor name + email in search
        .lean(),
      Contractor.countDocuments(query),
    ]);

    return res.status(200).json({
      items,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    console.error("searchContractors error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

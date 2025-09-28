// server/controllers/contractorController.js
const Contractor = require("../models/Contractor");

// Create contractor profile (only once)
exports.createContractor = async (req, res) => {
  try {
    const existing = await Contractor.findOne({ user: req.user.id });
    if (existing) {
      return res.status(400).json({ message: "Profile already exists" });
    }

    // ✅ Flexible handling of services (string OR array)
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
    // ✅ Ensure services always array
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

// Get contractor profile by user ID
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

// Public: search contractors
exports.searchContractors = async (req, res) => {
  try {
    const contractors = await Contractor.find();
    res.json(contractors);
  } catch (err) {
    console.error("❌ Search contractors error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

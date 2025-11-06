// server/controllers/contractorController.js
const Contractor = require("../models/Contractor");
const User = require("../models/User");

// Create contractor profile
const createContractor = async (req, res) => {
  try {
    const existing = await Contractor.findOne({ user: req.user.id });
    if (existing) {
      return res.status(400).json({ 
        success: false,
        message: "Profile already exists. Use update instead." 
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    let services = [];
    if (Array.isArray(req.body.services)) {
      services = req.body.services.map((s) => s.trim()).filter(Boolean);
    } else if (typeof req.body.services === "string") {
      services = req.body.services.split(",").map((s) => s.trim()).filter(Boolean);
    }

    const contractor = new Contractor({
      user: req.user.id,
      companyName: req.body.companyName,
      email: user.email,
      services,
      location: req.body.location || {},
      experience: req.body.experience || 0,
      phone: req.body.phone,
      bio: req.body.bio || "",
      availability: req.body.availability || 'Available',
      hoursPerDay: req.body.hoursPerDay || 8,
      workSpeed: req.body.workSpeed || 40,
      hourlyRate: req.body.hourlyRate || 0,
      profilePicture: req.body.profilePicture || "",
      website: req.body.website || "",
    });

    await contractor.save();
    await contractor.populate('user', 'name email');

    res.status(201).json({
      success: true,
      message: "Contractor profile created successfully",
      data: contractor
    });
  } catch (err) {
    console.error("❌ Create contractor error:", err);
    res.status(500).json({ 
      success: false,
      message: err.message || "Server error creating contractor profile" 
    });
  }
};

// Update contractor profile
const updateContractor = async (req, res) => {
  try {
    const contractor = await Contractor.findById(req.params.id);
    
    if (!contractor) {
      return res.status(404).json({ 
        success: false,
        message: "Profile not found" 
      });
    }

    if (contractor.user.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        message: "Not authorized to update this profile" 
      });
    }

    let updateData = { ...req.body };
    if (updateData.services) {
      if (Array.isArray(updateData.services)) {
        updateData.services = updateData.services.map((s) => s.trim()).filter(Boolean);
      } else if (typeof updateData.services === "string") {
        updateData.services = updateData.services.split(",").map((s) => s.trim()).filter(Boolean);
      }
    }

    const updatedContractor = await Contractor.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: updatedContractor
    });
  } catch (err) {
    console.error("❌ Update contractor error:", err);
    res.status(500).json({ 
      success: false,
      message: err.message || "Server error updating contractor profile" 
    });
  }
};

// Delete contractor profile
const deleteContractor = async (req, res) => {
  try {
    const contractor = await Contractor.findById(req.params.id);
    
    if (!contractor) {
      return res.status(404).json({ 
        success: false,
        message: "Profile not found" 
      });
    }

    if (contractor.user.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        message: "Not authorized to delete this profile" 
      });
    }

    await contractor.deleteOne();
    
    res.json({ 
      success: true,
      message: "Profile deleted successfully" 
    });
  } catch (err) {
    console.error("❌ Delete contractor error:", err);
    res.status(500).json({ 
      success: false,
      message: err.message || "Server error deleting contractor profile" 
    });
  }
};

// Get contractor by user ID
const getContractorByUserId = async (req, res) => {
  try {
    const contractor = await Contractor.findOne({ user: req.params.userId })
      .populate('user', 'name email');
    
    if (!contractor) {
      return res.status(404).json({ 
        success: false,
        message: "Profile not found" 
      });
    }

    res.json({
      success: true,
      data: contractor
    });
  } catch (err) {
    console.error("❌ Get contractor by userId error:", err);
    res.status(500).json({ 
      success: false,
      message: err.message || "Server error fetching contractor profile" 
    });
  }
};

// Get contractor by ID
const getContractorById = async (req, res) => {
  try {
    const contractor = await Contractor.findById(req.params.id)
      .populate("user", "name email");

    if (!contractor) {
      return res.status(404).json({ 
        success: false,
        message: "Profile not found" 
      });
    }

    res.json({
      success: true,
      data: contractor
    });
  } catch (err) {
    console.error("❌ Get contractor by ID error:", err);
    res.status(500).json({ 
      success: false,
      message: err.message || "Server error fetching contractor profile" 
    });
  }
};

// Search contractors
const searchContractors = async (req, res) => {
  try {
    const { city, service, q, page = 1, limit = 12, availability } = req.query;
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

    if (availability) {
      query.availability = availability;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      Contractor.find(query)
        .sort({ rating: -1, createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate("user", "name email")
        .lean(),
      Contractor.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      count: items.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: items
    });
  } catch (err) {
    console.error("❌ Search contractors error:", err);
    return res.status(500).json({ 
      success: false,
      message: err.message || "Server error searching contractors" 
    });
  }
};

// Get my profile
const getMyProfile = async (req, res) => {
  try {
    const contractor = await Contractor.findOne({ user: req.user.id })
      .populate('user', 'name email');
    
    if (!contractor) {
      return res.status(404).json({ 
        success: false,
        message: "Profile not found. Please create your profile first." 
      });
    }

    res.json({
      success: true,
      data: contractor
    });
  } catch (err) {
    console.error("❌ Get my profile error:", err);
    res.status(500).json({ 
      success: false,
      message: err.message || "Server error fetching profile" 
    });
  }
};

// Get all contractors
const getAllContractors = async (req, res) => {
  try {
    const contractors = await Contractor.find({})
      .sort({ rating: -1, createdAt: -1 })
      .populate("user", "name email")
      .lean();

    return res.status(200).json({
      success: true,
      count: contractors.length,
      data: contractors
    });
  } catch (err) {
    console.error("❌ Get all contractors error:", err);
    return res.status(500).json({ 
      success: false,
      message: err.message || "Server error fetching contractors" 
    });
  }
};

// Export all functions
module.exports = {
  createContractor,
  updateContractor,
  deleteContractor,
  getContractorByUserId,
  getContractorById,
  searchContractors,
  getMyProfile,
  getAllContractors
};
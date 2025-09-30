// server/routes/contractorRoutes.js
const express = require("express");
const router = express.Router();
const {
  createContractor,
  updateContractor,
  deleteContractor,
  searchContractors,
  getContractorByUserId,
  getContractorById, // ✅ new
} = require("../controllers/contractorController");

const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");

// Create contractor profile (Contractor only, one-time)
router.post("/", authenticateToken, authorizeRoles("contractor"), createContractor);

// Update contractor profile by ID
router.put("/:id", authenticateToken, authorizeRoles("contractor"), updateContractor);

// Delete contractor profile by ID
router.delete("/:id", authenticateToken, authorizeRoles("contractor"), deleteContractor);

// Get contractor profile by userId (private dashboard use)
router.get("/user/:userId", authenticateToken, getContractorByUserId);

// 🔹 Public: Get contractor by contractor ID
router.get("/:id", getContractorById);

// Public: search contractors
router.get("/", searchContractors);

module.exports = router;

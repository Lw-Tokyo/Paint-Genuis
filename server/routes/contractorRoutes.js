// server/routes/contractorRoutes.js
const express = require("express");
const router = express.Router();
const contractorController = require("../controllers/contractorController");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");

// ========== PUBLIC ROUTES (MUST BE FIRST) ==========
router.get("/search", contractorController.searchContractors);

// ========== PROTECTED ROUTES ==========
router.get("/me", authenticateToken, authorizeRoles("contractor"), contractorController.getMyProfile);
router.get("/user/:userId", authenticateToken, contractorController.getContractorByUserId);
router.post("/", authenticateToken, authorizeRoles("contractor"), contractorController.createContractor);
router.put("/:id", authenticateToken, authorizeRoles("contractor"), contractorController.updateContractor);
router.delete("/:id", authenticateToken, authorizeRoles("contractor"), contractorController.deleteContractor);

// ========== PUBLIC ROUTES (DYNAMIC - MUST BE LAST) ==========
router.get("/:id", contractorController.getContractorById);

module.exports = router;
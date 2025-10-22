// server/routes/messageRoutes.js
const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const messageController = require("../controllers/messageController");

// Sanity checks
if (!auth || typeof auth.authenticateToken !== "function") {
  console.error("authenticateToken middleware missing or not a function:", auth);
}
if (!messageController) {
  console.error("messageController missing or not loaded:", messageController);
}

// ⚠️ IMPORTANT: Place specific routes BEFORE parameterized routes
// GET /api/messages -> list of conversations for logged-in user (MUST BE FIRST)
router.get("/", auth.authenticateToken, async (req, res, next) => {
  try {
    if (typeof messageController.getUserConversations !== "function") {
      return res.status(500).json({ message: "getUserConversations handler not available" });
    }
    return await messageController.getUserConversations(req, res, next);
  } catch (err) {
    next(err);
  }
});

// POST /api/messages -> send message
router.post("/", auth.authenticateToken, async (req, res, next) => {
  try {
    if (typeof messageController.sendMessage !== "function") {
      return res.status(500).json({ message: "sendMessage handler not available" });
    }
    return await messageController.sendMessage(req, res, next);
  } catch (err) {
    next(err);
  }
});

// GET /api/messages/:userId -> conversation with that user (MUST BE LAST)
router.get("/:userId", auth.authenticateToken, async (req, res, next) => {
  try {
    if (typeof messageController.getConversation !== "function") {
      return res.status(500).json({ message: "getConversation handler not available" });
    }
    return await messageController.getConversation(req, res, next);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
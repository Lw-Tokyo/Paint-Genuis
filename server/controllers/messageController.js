// server/controllers/messageController.js
const Message = require("../models/Message");
const User = require("../models/User");
const Contractor = require("../models/Contractor");

/**
 * Send a message
 * Accepts: { receiverId | receiver, text | message | content }
 */
const sendMessage = async (req, res) => {
  try {
    const receiver = req.body.receiver || req.body.receiverId || req.body.recipient;
    const text = req.body.text || req.body.message || req.body.content;
    const sender = req.user.id;

    if (!receiver || !text) {
      return res.status(400).json({ error: "Receiver and text are required" });
    }

    const message = new Message({
      sender,
      receiver,
      text,
    });

    await message.save();

    // populate sender + receiver for frontend (name + role)
    const populatedMsg = await message
      .populate("sender", "name role")
      .populate("receiver", "name role");

    return res.status(201).json(populatedMsg);
  } catch (error) {
    console.error("Send message error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

/**
 * Get conversation (messages) between logged-in user and otherUserId
 * route: GET /api/messages/:userId
 */
const getConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    const otherUserId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId },
      ],
    })
      .populate("sender", "name role")
      .populate("receiver", "name role")
      .sort({ createdAt: 1 });

    return res.json(messages);
  } catch (error) {
    console.error("Get conversation error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

/**
 * Get user's conversations (unique partners + last message)
 * route: GET /api/messages
 */
const getUserConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    // load messages where the user is either sender or receiver
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .populate("sender", "name role")
      .populate("receiver", "name role")
      .sort({ createdAt: -1 });

    // map otherUserId => conversation summary (keep latest)
    const conversationsMap = new Map();

    messages.forEach((msg) => {
      const otherUser =
        msg.sender._id.toString() === userId ? msg.receiver : msg.sender;
      const key = otherUser._id.toString();

      const existing = conversationsMap.get(key);

      if (
        !existing ||
        new Date(msg.createdAt) > new Date(existing.lastMessageAt)
      ) {
        conversationsMap.set(key, {
          _id: otherUser._id,
          name: otherUser.name,
          role: otherUser.role,
          lastMessage: msg.text,
          lastMessageAt: msg.createdAt,
        });
      }
    });

    // try to enrich with contractor/companyName if partner is contractor
    const partnerIds = Array.from(conversationsMap.keys());
    let contractorDocs = [];
    if (partnerIds.length) {
      contractorDocs = await Contractor.find({
        user: { $in: partnerIds },
      }).select("user companyName specialization").lean();
    }
    const contractorByUser = new Map(
      contractorDocs.map((c) => [c.user.toString(), c])
    );

    const conversations = Array.from(conversationsMap.values()).map((c) => ({
      ...c,
      specialization:
        contractorByUser.get(c._id.toString())?.companyName ||
        contractorByUser.get(c._id.toString())?.specialization ||
        "",
    }));

    return res.json(conversations);
  } catch (error) {
    console.error("Get user conversations error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  sendMessage,
  getConversation,
  getUserConversations,
};

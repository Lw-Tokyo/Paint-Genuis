// client\src\services\MessageService.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/messages";

function getStoredToken() {
  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const u = JSON.parse(userStr);
      return u?.token || null;
    }
    return localStorage.getItem("token") || null;
  } catch (e) {
    return null;
  }
}

function getAuthHeader(token) {
  const t = token || getStoredToken();
  return t ? { headers: { Authorization: `Bearer ${t}` } } : {};
}

// Send message
const sendMessage = async (receiverId, text, token) => {
  const res = await axios.post(
    API_URL,
    { receiverId, text },
    getAuthHeader(token)
  );
  return res.data;
};

// Get chat history with a specific user
const getMessages = async (userId, token) => {
  const res = await axios.get(`${API_URL}/${userId}`, getAuthHeader(token));
  return res.data;
};

// ✅ Fixed: Get all conversations for logged-in user
const getConversations = async (token) => {
  const res = await axios.get(`${API_URL}`, getAuthHeader(token));
  return res.data;
};

const MessageService = {
  sendMessage,
  getMessages,
  getConversations,
};

export default MessageService;

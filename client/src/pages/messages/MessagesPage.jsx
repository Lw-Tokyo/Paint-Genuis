// client/src/pages/messages/MessagesPage.jsx
import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import "./MessagesPage.css";
import MessageService from "../../services/MessageService";
import { UserContext } from "../../context/UserContext";

function MessagesPage() {
  const { user } = useContext(UserContext); // logged-in user
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const location = useLocation();

  // Load all conversations for logged-in user
  useEffect(() => {
    if (user?.token) {
      MessageService.getConversations(user.token)
        .then((data) => setConversations(data || []))
        .catch((err) => console.error("Error loading conversations", err));
    }
  }, [user]);

  // If navigated with contractorId from profile
  useEffect(() => {
    if (location.state?.contractorId) {
      setActiveChat({
        _id: location.state.contractorId,
        name: location.state.name,
      });
    }
  }, [location]);

  // Fetch chat history when activeChat changes
  useEffect(() => {
    if (activeChat && user?._id) {
      MessageService.getMessages(activeChat._id, user?.token)
        .then((data) => setMessages(data || []))
        .catch((err) => console.error("Error loading messages", err));
    }
  }, [activeChat, user]);

  // Send message
  const handleSend = async () => {
    if (!newMessage.trim() || !activeChat) return;

    try {
      const msg = await MessageService.sendMessage(
        activeChat._id,
        newMessage,
        user?.token
      );
      setMessages((prev) => [...prev, msg]);
      setNewMessage("");
      // update conversations (move this chat to top)
      setConversations((prev) => {
        const others = prev.filter((c) => c._id !== activeChat._id);
        return [{ ...activeChat, lastMessage: msg.text }, ...others];
      });
    } catch (err) {
      console.error("Send message error", err);
    }
  };

  return (
    <div className="messages-page">
      {/* Left Sidebar - Conversations */}
      <div className="conversations">
        <h3>Conversations</h3>
        {conversations.length === 0 && <p>No conversations yet.</p>}
        {conversations.map((c) => (
          <div
            key={c._id}
            className={`conversation ${
              activeChat?._id === c._id ? "active" : ""
            }`}
            onClick={() => setActiveChat(c)}
          >
            <div className="conversation-name">{c.name}</div>
            <div className="conversation-last">{c.lastMessage}</div>
          </div>
        ))}
      </div>

      {/* Right Chat Window */}
      <div className="chat-window">
        {activeChat ? (
          <>
            <div className="chat-header">
              <h3>{activeChat.name}</h3>
            </div>

            <div className="chat-messages">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`chat-message ${
                    msg.sender?._id === user._id ? "me" : "them"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            <div className="chat-input">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button onClick={handleSend}>Send</button>
            </div>
          </>
        ) : (
          <div className="chat-empty">Select a conversation</div>
        )}
      </div>
    </div>
  );
}

export default MessagesPage;

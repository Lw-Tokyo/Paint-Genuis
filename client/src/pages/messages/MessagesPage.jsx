// client/src/pages/messages/MessagesPage.jsx
import React, { useState, useEffect, useContext, useRef } from "react";
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
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const messagesEndRef = useRef(null);
  const pollingIntervalRef = useRef(null);

  // ✅ Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ✅ Function to load conversations
  const loadConversations = async () => {
    if (user?.token) {
      try {
        const data = await MessageService.getConversations(user.token);
        setConversations(data || []);
      } catch (err) {
        console.error("Error loading conversations", err);
      }
    }
  };

  // ✅ Function to load messages for active chat
  const loadMessages = async () => {
    if (activeChat && user?._id && user?.token) {
      try {
        const data = await MessageService.getMessages(activeChat._id, user.token);
        setMessages(data || []);
      } catch (err) {
        console.error("Error loading messages", err);
      }
    }
  };

  // Load all conversations for logged-in user
  useEffect(() => {
    loadConversations();
  }, [user]);

  // If navigated with contractorId from profile
  useEffect(() => {
    if (location.state?.contractorId) {
      setActiveChat({
        _id: location.state.contractorId,
        name: location.state.name || "User",
      });
    }
  }, [location]);

  // ✅ Fetch chat history when activeChat changes
  useEffect(() => {
    if (activeChat && user?._id) {
      loadMessages();
    } else {
      setMessages([]);
    }
  }, [activeChat, user]);

  // ✅ Poll for new messages every 3 seconds when chat is active
  useEffect(() => {
    if (activeChat && user?.token) {
      // Clear existing interval
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }

      // Set up new polling interval
      pollingIntervalRef.current = setInterval(() => {
        loadMessages();
        loadConversations(); // Also refresh conversations list
      }, 3000); // Poll every 3 seconds

      // Cleanup on unmount or when activeChat changes
      return () => {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
        }
      };
    }
  }, [activeChat, user]);

  // ✅ Send message and refresh properly
  const handleSend = async () => {
    if (!newMessage.trim() || !activeChat) return;

    setIsLoading(true);
    try {
      const msg = await MessageService.sendMessage(
        activeChat._id,
        newMessage,
        user?.token
      );
      
      // ✅ Add message to current chat immediately (optimistic update)
      setMessages((prev) => [...prev, msg]);
      setNewMessage("");

      // ✅ Reload conversations to update the sidebar
      await loadConversations();
      
    } catch (err) {
      console.error("Send message error", err);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
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
                  key={msg._id || index}
                  className={`chat-message ${
                    msg.sender?._id === user._id || msg.sender === user._id ? "me" : "them"
                  }`}
                >
                  <div className="message-text">{msg.text}</div>
                  <div className="message-time">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSend()}
                disabled={isLoading}
              />
              <button onClick={handleSend} disabled={isLoading}>
                {isLoading ? "Sending..." : "Send"}
              </button>
            </div>
          </>
        ) : (
          <div className="chat-empty">Select a conversation to start messaging</div>
        )}
      </div>
    </div>
  );
}

export default MessagesPage;
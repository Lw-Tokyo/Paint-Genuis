
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import DashboardHome from "./pages/DashboardHome";
import MessagesPage from "./pages/MessagesPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

function AdminApp() {
  return (
    <Router>
      <div className="d-flex">
        <Sidebar />
        <div className="p-4 flex-grow-1" style={{ backgroundColor: "#1c1c1c", color: "#fff", minHeight: "100vh" }}>
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default AdminApp;

// src/components/layout/DashboardLayout.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
//import { motion } from "framer-motion";
import AuthService from "../../services/AuthService";

function DashboardLayout({ children, role }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    AuthService.logout();
    navigate("/auth");
  };

  const navLinks = {
    admin: [
      { label: "Dashboard", to: "/admin/dashboard" },
      { label: "Messages", to: "/admin/messages" },
    ],
    contractor: [
      { label: "Dashboard", to: "/contractor/dashboard" },
      { label: "Hire Painter", to: "/contractor/hire" },
    ],
    painter: [
      { label: "Dashboard", to: "/painter/dashboard" },
      { label: "Availability", to: "/painter/availability" },
    ],
    client: [
      { label: "Dashboard", to: "/client/dashboard" },
      { label: "Estimates", to: "/client/estimates" },
    ],
  };

  return (
    <div className="d-flex vh-100 bg-dark text-white">
      {/* Sidebar */}
      <div className="bg-secondary p-3" style={{ width: "250px" }}>
        <h4 className="mb-4">Paint Genius</h4>
        <nav className="nav flex-column">
          {(navLinks[role] || []).map((link, index) => (
            <Link
              key={index}
              to={link.to}
              className="nav-link text-white mb-2"
            >
              {link.label}
            </Link>
          ))}
          <button
            className="btn btn-danger mt-4"
            onClick={handleLogout}
          >
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div
        className="flex-grow-1 p-4 overflow-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {children}
      </div>
    </div>
  );
}

export default DashboardLayout;

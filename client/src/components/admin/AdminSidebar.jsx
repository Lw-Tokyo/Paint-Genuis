import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaTachometerAlt, FaEnvelope, FaSignOutAlt } from "react-icons/fa";

function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const linkStyle = ({ isActive }) =>
    `d-flex align-items-center gap-2 p-3 sidebar-link ${isActive ? "active" : ""}`;

  return (
    <div
      style={{
        height: "100vh",
        backgroundColor: "#161b22",
        color: "#fff",
        borderRight: "1px solid #30363d",
        position: "sticky",
        top: 0
      }}
    >
      <div className="p-4 text-center border-bottom border-dark">
        <h4 style={{ color: "#58a6ff" }}>Paint Genius</h4>
      </div>

      <nav className="d-flex flex-column mt-3">
        <NavLink to="/admin" className={linkStyle}>
          <FaTachometerAlt />
          Dashboard
        </NavLink>

        <NavLink to="/admin/messages" className={linkStyle}>
          <FaEnvelope />
          Messages
        </NavLink>

        <button
          onClick={handleLogout}
          className="btn btn-danger mx-3 mt-4 d-flex align-items-center gap-2"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </nav>

      <div className="mt-auto p-3 text-center text-muted small">
        © 2025 Paint Genius
      </div>
    </div>
  );
}

export default AdminSidebar;

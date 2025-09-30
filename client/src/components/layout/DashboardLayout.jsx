// client/src/components/layout/DashboardLayout.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./DashboardLayout.css";

function DashboardLayout({ children, role, user }) {
  const location = useLocation();

  // Sidebar links by role
  const links = {
    client: [
      { path: "/client/dashboard", label: "Dashboard" },
      { path: "/contractors", label: "Find Contractors" },
      { path: "/messages", label: "Messages" },
    ],
    contractor: [
      { path: "/contractor/dashboard", label: "Dashboard" },
      { path: "/jobs", label: "Jobs" },
      { path: "/messages", label: "Messages" },
    ],
    admin: [
      { path: "/admin/dashboard", label: "Dashboard" },
      { path: "/users", label: "Manage Users" },
      { path: "/reports", label: "Reports" },
    ],
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>👋 Welcome</h2>
          <p className="username">{user?.name || "User"}</p>
        </div>
        <nav className="sidebar-nav">
          {links[role]?.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${
                location.pathname === link.path ? "active" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">{children}</main>
    </div>
  );
}

export default DashboardLayout;
